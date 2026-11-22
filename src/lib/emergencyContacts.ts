export interface EmergencyContact {
  id: number | string;
  name: string;
  category: "emergency" | "hospital" | "police" | "fire" | "rescue";
  phone: string;
  description: string;
  address: string;
  distance: string;
  rating: number;
  isNational: boolean;
}

export const getContactsForState = (state: string, city?: string): EmergencyContact[] => {
  const trimmed = (state || "Uttar Pradesh").trim();
  const locName = city ? `${city}, ${trimmed}` : trimmed;

  const baseNational: EmergencyContact[] = [
    {
      id: "nat-1",
      name: "National Emergency Helpline",
      category: "emergency",
      phone: "112",
      description: "Unified 24/7 all-in-one emergency number for Police, Fire, Ambulance & SDRF",
      address: "All-India Emergency Response Support System (ERSS)",
      distance: "Nationwide Toll-Free",
      rating: 5.0,
      isNational: true
    },
    {
      id: "nat-2",
      name: "Disaster Management Control (NDMA)",
      category: "rescue",
      phone: "1070",
      description: "National & State Disaster Management 24/7 relief coordination",
      address: "NDMA Headquarters & State EOC",
      distance: "Statewide Toll-Free",
      rating: 4.8,
      isNational: true
    },
    {
      id: "nat-3",
      name: "Emergency Medical Ambulance",
      category: "hospital",
      phone: "108",
      description: "Free emergency ambulance and mobile medical trauma services",
      address: "National Health Mission Network",
      distance: "Fastest Local Dispatch",
      rating: 4.7,
      isNational: true
    },
    {
      id: "nat-4",
      name: "Fire Emergency Services",
      category: "fire",
      phone: "101",
      description: "Fire rescue, hazardous chemical response & building evacuation",
      address: "State Fire Headquarters & Local Station",
      distance: "Under 10 mins",
      rating: 4.9,
      isNational: true
    },
    {
      id: "nat-5",
      name: "Police Emergency Control",
      category: "police",
      phone: "100",
      description: "Immediate law enforcement, safety patrol & incident response",
      address: "District Police Control Room",
      distance: "Immediate Response",
      rating: 4.6,
      isNational: true
    },
    {
      id: "nat-6",
      name: "Child Helpline & Student Care",
      category: "emergency",
      phone: "1098",
      description: "Dedicated 24/7 helpline for student protection, distress & child safety",
      address: "Ministry of Women and Child Development",
      distance: "24/7 Toll-Free",
      rating: 4.9,
      isNational: true
    }
  ];

  // State-specific additions
  const stateAdditions: Record<string, EmergencyContact[]> = {
    "Uttar Pradesh": [
      {
        id: "up-hosp-1",
        name: "KGMU Trauma Center & Medical Emergency",
        category: "hospital",
        phone: "+91-522-2257540",
        description: "Level-1 Super-specialty disaster trauma & emergency medical care",
        address: "King George's Medical University, Lucknow, Uttar Pradesh",
        distance: "Apex Trauma Facility",
        rating: 4.8,
        isNational: false
      },
      {
        id: "up-pol-1",
        name: "UP 112 Integrated Citizen Control Center",
        category: "police",
        phone: "112",
        description: "Uttar Pradesh centralized high-speed police response fleet",
        address: "UP 112 Headquarters, Shaheed Path, Lucknow",
        distance: "Average 12 mins response",
        rating: 4.7,
        isNational: false
      },
      {
        id: "up-resc-1",
        name: "UP State Disaster Management Authority (UPSDMA)",
        category: "rescue",
        phone: "+91-522-2720828",
        description: "Disaster mitigation, relief coordination & SDRF deployment",
        address: "Picup Bhawan, Gomti Nagar, Lucknow",
        distance: "State EOC Facility",
        rating: 4.6,
        isNational: false
      }
    ],
    "Punjab": [
      {
        id: "pb-hosp-1",
        name: "PGIMER Apex Emergency Care",
        category: "hospital",
        phone: "+91-172-2756565",
        description: "Premier multi-specialty regional disaster trauma hospital",
        address: "Sector 12, Chandigarh / Punjab Border",
        distance: "Regional Tertiary Center",
        rating: 4.9,
        isNational: false
      },
      {
        id: "pb-pol-1",
        name: "Punjab Police Emergency Operations",
        category: "police",
        phone: "112",
        description: "Rapid rural and urban emergency response network across Punjab",
        address: "Punjab Police Headquarters, Sector 9, Chandigarh",
        distance: "Statewide Coverage",
        rating: 4.6,
        isNational: false
      },
      {
        id: "pb-resc-1",
        name: "Punjab State Disaster Control Room",
        category: "rescue",
        phone: "+91-172-2740397",
        description: "Punjab Revenue & Disaster Management Department EOC",
        address: "Punjab Civil Secretariat, Chandigarh",
        distance: "Statewide EOC",
        rating: 4.5,
        isNational: false
      }
    ],
    "Delhi": [
      {
        id: "dl-hosp-1",
        name: "AIIMS Jai Prakash Narayan Apex Trauma Center",
        category: "hospital",
        phone: "+91-11-26188000",
        description: "National apex referral trauma hospital for multi-casualty disasters",
        address: "Raj Nagar, Safdarjung Enclave, New Delhi",
        distance: "Apex Trauma Hospital",
        rating: 4.9,
        isNational: false
      },
      {
        id: "dl-pol-1",
        name: "Delhi Police Central Control Room",
        category: "police",
        phone: "112",
        description: "Metropolitan emergency police patrol and rapid response units",
        address: "Delhi Police Headquarters, Jai Singh Road, New Delhi",
        distance: "Citywide Coverage",
        rating: 4.7,
        isNational: false
      },
      {
        id: "dl-fire-1",
        name: "Delhi Fire Service Headquarters",
        category: "fire",
        phone: "101",
        description: "Metropolitan fire safety, rescue and hazardous incident control",
        address: "Connaught Place, New Delhi",
        distance: "Central Dispatch",
        rating: 4.6,
        isNational: false
      }
    ],
    "Maharashtra": [
      {
        id: "mh-hosp-1",
        name: "KEM Hospital & Trauma Center",
        category: "hospital",
        phone: "+91-22-24107000",
        description: "Premier emergency hospital and disaster trauma center in Mumbai",
        address: "Acharya Donde Marg, Parel, Mumbai",
        distance: "Apex Municipal Hospital",
        rating: 4.7,
        isNational: false
      },
      {
        id: "mh-pol-1",
        name: "Mumbai Police Emergency Control",
        category: "police",
        phone: "112",
        description: "Greater Mumbai police patrol and maritime coastal police units",
        address: "Crawford Market, Mumbai Police HQ",
        distance: "Citywide Fast Response",
        rating: 4.8,
        isNational: false
      },
      {
        id: "mh-resc-1",
        name: "BMC Central Disaster Control Room",
        category: "rescue",
        phone: "1916",
        description: "24/7 disaster management, waterlogging & flood evacuation coordination",
        address: "BMC Headquarters, Fort, Mumbai",
        distance: "Municipal EOC",
        rating: 4.7,
        isNational: false
      }
    ]
  };

  const specific = stateAdditions[trimmed] || [
    {
      id: `state-hosp-${trimmed}`,
      name: `${trimmed} District Civil Hospital Emergency`,
      category: "hospital",
      phone: "108",
      description: `Chief emergency healthcare facility and trauma unit for ${locName}`,
      address: `Civil Hospital Complex, ${locName}`,
      distance: "Local Facility",
      rating: 4.6,
      isNational: false
    },
    {
      id: `state-pol-${trimmed}`,
      name: `${trimmed} State Police Emergency Response`,
      category: "police",
      phone: "112",
      description: `State law enforcement and 24/7 safety patrol service for ${trimmed}`,
      address: `District Police Line, ${locName}`,
      distance: "Prompt Dispatch",
      rating: 4.7,
      isNational: false
    },
    {
      id: `state-sdma-${trimmed}`,
      name: `${trimmed} State Disaster Relief Control Room`,
      category: "rescue",
      phone: "1070",
      description: `State Disaster Management Authority emergency operations for ${trimmed}`,
      address: `State Civil Secretariat, ${trimmed}`,
      distance: "State EOC",
      rating: 4.5,
      isNational: false
    }
  ];

  return [...baseNational, ...specific];
};
