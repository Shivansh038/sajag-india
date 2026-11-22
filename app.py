import os
import json
from typing import List, Optional
from threading import Thread
from supabase import create_client
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from webpush import WebPush, WebPushSubscription
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# VAPID keys for push notifications
VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY")
VAPID_PUBLIC_KEY = os.getenv("VAPID_PUBLIC_KEY")
VAPID_CONTACT = "mailto:your_email@example.com"

# Supabase setup for push subscriptions
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

# Create a Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY) if SUPABASE_URL and SUPABASE_ANON_KEY else None

# FastAPI app setup
app = FastAPI(title="Sajag Disaster Preparedness API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Push notification models and endpoints
class SubscribeRequest(BaseModel):
    userId: str
    subscription: WebPushSubscription

@app.post("/subscribe")
async def subscribe(request: SubscribeRequest):
    """
    Saves a user's web push subscription to the database.
    """
    print(f"Received subscription request for userId: {request.userId}")
    print(f"Subscription data: {request.subscription.model_dump_json(indent=2)}")
    
    try:
        subscription_data = {
            "uid": request.userId,
            "subscription": request.subscription.model_dump()
        }
        supabase.table("push_subscriptions").insert(subscription_data).execute()
        return {"message": "Subscription saved successfully."}
    except Exception as e:
        print(f"Error saving subscription: {e}")
        raise HTTPException(status_code=500, detail=f"Error saving subscription: {e}")

def send_push_notification_to_state(state: str, title: str, body: str):
    try:
        users = supabase.table("users").select("uid").eq("state", state).execute()
        
        for user in users.data:
            subscription_record = supabase.table("push_subscriptions").select("*").eq("uid", user["uid"]).limit(1).execute()
            if subscription_record.data:
                subscription = subscription_record.data[0]["subscription"]
                
                message = json.dumps({"title": title, "body": body})
                
                WebPush(
                    subscription_info=subscription,
                    data=message,
                    vapid_private_key=VAPID_PRIVATE_KEY,
                    vapid_public_key=VAPID_PUBLIC_KEY,
                    vapid_contact=VAPID_CONTACT,
                )
    except Exception as e:
        print(f"Error sending push notification: {e}")

@app.get("/send_test_alert")
async def send_test_alert(state: str = "Punjab", title: str = "Test Alert", body: str = "This is a test notification."):
    send_push_notification_to_state(state, title, body)
    return {"message": "Test alert sent."}

# Pydantic models for the new endpoints
class LearningProgressUpdate(BaseModel):
    userId: str
    moduleId: str

class LearningProgressResponse(BaseModel):
    progress: float
    quiz_completed: bool

class MarkQuizCompletedRequest(BaseModel):
    userId: str

# New endpoints for learning progress
@app.get("/learning_progress/{userId}", response_model=LearningProgressResponse)
async def get_learning_progress(userId: str):
    """
    Retrieves a student's learning progress from the database.
    """
    try:
        response = supabase.table("Student").select("learning_progress, quiz_completed").eq("student_id", userId).single().execute()
        student_data = response.data
        
        if not student_data:
            raise HTTPException(status_code=404, detail="Student not found.")
            
        return LearningProgressResponse(
            progress=student_data.get("learning_progress", 0),
            quiz_completed=student_data.get("quiz_completed", False)
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

@app.post("/update_learning_progress", response_model=LearningProgressResponse)
async def update_learning_progress(request: LearningProgressUpdate):
    """
    Updates a student's learning progress in the database after completing a module.
    
    The final 10% of the progress is reserved for the quiz.
    """
    userId = request.userId
    moduleId = request.moduleId
    
    try:
        # Fetch the current student record
        response = supabase.table("Student").select("*").eq("student_id", userId).single().execute()
        student_data = response.data
        
        if not student_data:
            raise HTTPException(status_code=404, detail="Student not found.")
            
        learning_progress = student_data.get("learning_progress", 0)
        completed_modules = student_data.get("completed_modules", [])
        
        # Check if the module is already completed
        if moduleId in completed_modules:
            return LearningProgressResponse(progress=learning_progress, quiz_completed=student_data.get("quiz_completed", False))

        # Add the new module to the list of completed modules
        completed_modules.append(moduleId)
        
        # Calculate new progress. Assuming there are 20 modules total.
        total_modules = 20
        module_points = 90 / total_modules  # 90% for all modules
        
        new_progress = min(90, len(completed_modules) * module_points)
        
        # Update the student record in Supabase
        update_response = supabase.table("Student").update({
            "learning_progress": new_progress,
            "completed_modules": completed_modules
        }).eq("student_id", userId).execute()
        
        if update_response.error:
            raise HTTPException(status_code=500, detail=update_response.error.message)
            
        return LearningProgressResponse(progress=new_progress, quiz_completed=student_data.get("quiz_completed", False))
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

@app.post("/mark_quiz_completed", response_model=LearningProgressResponse)
async def mark_quiz_completed(request: MarkQuizCompletedRequest):
    """
    Marks the quiz as completed for a student and updates progress to 100%.
    """
    userId = request.userId
    
    try:
        response = supabase.table("Student").update({
            "quiz_completed": True,
            "learning_progress": 100
        }).eq("student_id", userId).execute()
        
        if response.error:
            raise HTTPException(status_code=500, detail=response.error.message)
            
        return LearningProgressResponse(progress=100, quiz_completed=True)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")