import requests
import xml.etree.ElementTree as ET
import time
import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv()

# Configuration
NDMA_API_BASE_URL = "https://sachet.ndma.gov.in/cap_public_website/rss/rss_"
BACKEND_URL = "http://localhost:8000"  # Update this to your deployed backend URL

# Supabase setup
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# To store the last known alert for each state
last_known_alert = {}

def get_all_states_from_db():
    """Retrieves a unique list of states from the 'users' table in Supabase."""
    try:
        response = supabase.table("users").select("state").execute()
        if response.data:
            # Extract unique states and return as a list
            states = list(set(user["state"] for user in response.data))
            return states
        return []
    except Exception as e:
        print(f"Error fetching states from database: {e}")
        return []

def fetch_and_parse_alerts(state: str):
    """Fetches and parses the NDMA XML feed for a given state."""
    state_slug = state.lower().replace(" ", "")
    url = f"{NDMA_API_BASE_URL}{state_slug}.xml"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        root = ET.fromstring(response.content)
        alerts = []
        for item in root.findall(".//item"):
            title = item.find("title").text if item.find("title") is not None else ""
            description = item.find("description").text if item.find("description") is not None else ""
            pub_date = item.find("pubDate").text if item.find("pubDate") is not None else ""
            
            alerts.append({
                "title": title,
                "body": description,
                "pub_date": pub_date
            })
        return alerts
    except requests.exceptions.RequestException as e:
        print(f"Error fetching NDMA alerts for {state}: {e}")
        return []
    except ET.ParseError as e:
        print(f"Error parsing XML for {state}: {e}")
        return []

def main_check_loop():
    """Main loop to check for alerts and send notifications for all states."""
    global last_known_alert
    
    states_to_check = get_all_states_from_db()
    if not states_to_check:
        print("No states found in the database. Exiting loop.")
        return

    for state in states_to_check:
        print(f"Checking for new alerts for {state}...")
        new_alerts = fetch_and_parse_alerts(state)
        
        if new_alerts:
            latest_alert = new_alerts[0]
            
            state_key = state.lower().replace(" ", "")
            last_alert_for_state = last_known_alert.get(state_key)
            
            if latest_alert != last_alert_for_state:
                print(f"New alert detected for {state}! Sending push notification...")
                
                try:
                    alert_payload = {
                        "state": state,
                        "title": latest_alert["title"],
                        "body": latest_alert["body"]
                    }
                    response = requests.get(f"{BACKEND_URL}/send_test_alert", params=alert_payload)
                    response.raise_for_status()
                    print("Notification sent successfully.")
                    
                    last_known_alert[state_key] = latest_alert
                except requests.exceptions.RequestException as e:
                    print(f"Error sending notification via backend for {state}: {e}")
            else:
                print(f"No new alerts for {state}.")
        else:
            print(f"No alerts found in the feed for {state}.")

if __name__ == "__main__":
    while True:
        main_check_loop()
        print("Waiting for 5 minutes before the next check...")
        time.sleep(300) # Wait for 5 minutes (300 seconds)