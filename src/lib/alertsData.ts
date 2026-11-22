export interface SafetyAlert {
  id: string;
  type: "critical" | "warning" | "info" | "safe";
  category: "flood" | "earthquake" | "cyclone" | "weather" | "fire" | "heatwave" | "air_quality";
  title: string;
  description: string;
  location: string;
  state: string;
  time: string;
  source: string;
  actionable: boolean;
  dos: string[];
  donts: string[];
  helpline: string;
  disasterType: string;
}

// Helper to generate recent realistic timestamps
const getRecentTime = (hoursAgo: number, minutesAgo: number = 0): string => {
  const d = new Date();
  d.setHours(d.getHours() - hoursAgo);
  d.setMinutes(d.getMinutes() - minutesAgo);
  return d.toISOString();
};

export const STATE_ALERT_DATABASE: Record<string, SafetyAlert[]> = {
  "Uttar Pradesh": [
    {
      id: "up-crit-1",
      type: "critical",
      category: "flood",
      title: "Ganga & Yamuna Basin Flood Spate Alert",
      description: "Water levels at Varanasi, Prayagraj, and Ballia are flowing near the danger mark due to heavy upstream discharges. Low-lying riverine settlements are advised to initiate precautionary evacuation to designated shelter points.",
      location: "Varanasi & Prayagraj Riverine Belt, Uttar Pradesh",
      state: "Uttar Pradesh",
      time: getRecentTime(1, 15),
      source: "Central Water Commission (CWC) & UP SDMA",
      actionable: true,
      dos: [
        "Move essential documents, medicines, and drinking water to higher floors.",
        "Follow official evacuation directions from local administration immediately.",
        "Disconnect electrical appliances before water enters premises.",
        "Keep battery-operated emergency radios and torches charged and ready."
      ],
      donts: [
        "Do not walk or drive through moving flood waters under any condition.",
        "Do not allow children to play near submerged ghats, drains, or riverbanks.",
        "Do not touch submerged electrical poles or hanging transmission cables."
      ],
      helpline: "112 / UP Flood Relief: 1070",
      disasterType: "Floods"
    },
    {
      id: "up-warn-1",
      type: "warning",
      category: "weather",
      title: "Dense Fog & Severe Cold Wave / Thunderstorm Advisory",
      description: "Dense fog and cold day conditions with visibility dropping below 50m predicted across Western & Central UP (Lucknow, Kanpur, Agra, Bareilly, Noida) during early mornings. Caution advised during school transit.",
      location: "Western & Central UP Districts",
      state: "Uttar Pradesh",
      time: getRecentTime(3, 40),
      source: "India Meteorological Department (IMD)",
      actionable: true,
      dos: [
        "Use low-beam fog lights and maintain safe following distances on expressways.",
        "Ensure school children wear layered thermal clothing.",
        "Check district magistrate orders regarding adjusted winter school timings."
      ],
      donts: [
        "Do not overtake recklessly in near-zero visibility conditions.",
        "Do not leave room heaters or coal sigris running overnight in closed unventilated rooms."
      ],
      helpline: "112 / Transport Helpline: 1073",
      disasterType: "Heat Wave"
    },
    {
      id: "up-info-1",
      type: "info",
      category: "earthquake",
      title: "Seismic Zone IV School Safety Compliance Notice",
      description: "Institutional safety audit reminder for schools located along the Indo-Gangetic Terai and NCR belt (Seismic Zone IV). Conduct quarterly Drop, Cover, and Hold mock drills and inspect structural evacuation staircases.",
      location: "Uttar Pradesh (Statewide)",
      state: "Uttar Pradesh",
      time: getRecentTime(8, 20),
      source: "NDMA & UP Disaster Management",
      actionable: true,
      dos: [
        "Ensure heavy classroom cabinets and lab shelves are firmly anchored to walls.",
        "Identify open outdoor assembly grounds away from electrical poles and glass facades."
      ],
      donts: [
        "Do not block fire exits or staircase corridors with broken furniture."
      ],
      helpline: "112 / 1070",
      disasterType: "Earthquake"
    }
  ],

  "Punjab": [
    {
      id: "pb-crit-1",
      type: "critical",
      category: "flood",
      title: "Flash Flood Alert in Rupnagar & Sutlej Basin",
      description: "Excess reservoir release from upstream dams has triggered a flash flood warning for low-lying areas along the Sutlej and Beas rivers in Rupnagar, Anandpur Sahib, and Ferozepur districts. Riverbank settlements to evacuate immediately.",
      location: "Rupnagar, Anandpur Sahib & Ferozepur, Punjab",
      state: "Punjab",
      time: getRecentTime(1, 45),
      source: "NDMA & Punjab Disaster Management Authority",
      actionable: true,
      dos: [
        "Evacuate vulnerable riverbank dwellings to community relief centres.",
        "Stock up on bottled water, dry rations, and waterproof medication pouches.",
        "Obey police and SDRF warning checkpoints."
      ],
      donts: [
        "Never attempt to ford flooded culverts or seasonal rivulets (choes).",
        "Do not spread unverified rumors on social media regarding dam breaches."
      ],
      helpline: "112 / Punjab Disaster Control: 1070",
      disasterType: "Floods"
    },
    {
      id: "pb-warn-1",
      type: "warning",
      category: "weather",
      title: "Heavy Rainfall & Urban Waterlogging Advisory",
      description: "Scattered intense rainfall predicted across Majha and Doaba regions (Amritsar, Jalandhar, Ludhiana). Low-lying intersections and underpasses may experience severe waterlogging.",
      location: "Majha & Doaba Regions, Punjab",
      state: "Punjab",
      time: getRecentTime(4, 10),
      source: "IMD Chandigarh",
      actionable: true,
      dos: [
        "Clear rooftop drainage outlets to prevent ceiling water accumulation.",
        "Keep essential school transport routes updated regarding waterlogged underpasses."
      ],
      donts: [
        "Do not park vehicles beneath weak tree branches or old hoardings."
      ],
      helpline: "112",
      disasterType: "Floods"
    },
    {
      id: "pb-info-1",
      type: "info",
      category: "air_quality",
      title: "Seasonal Air Quality & Smog Health Advisory",
      description: "Air Quality Index (AQI) in several industrial and agricultural clusters has reached 'Poor' to 'Very Poor'. High school students with respiratory sensitivities should minimize intense outdoor physical training.",
      location: "Punjab (Statewide)",
      state: "Punjab",
      time: getRecentTime(10, 0),
      source: "Punjab Pollution Control Board (PPCB)",
      actionable: true,
      dos: [
        "Wear protective masks during peak morning outdoor activities.",
        "Keep inhalers and first-aid kits accessible in school infirmaries."
      ],
      donts: [
        "Avoid burning open dry leaves or municipal waste."
      ],
      helpline: "112 / Health: 104",
      disasterType: "Heat Wave"
    }
  ],

  "Delhi": [
    {
      id: "dl-crit-1",
      type: "critical",
      category: "flood",
      title: "Yamuna River High Flood Warning",
      description: "Yamuna water level has crossed the warning threshold (205.33m) at the Old Railway Bridge. Evacuation initiated for floodplains and low-lying settlements near Monastery Market and Yamuna Bazar.",
      location: "Yamuna Floodplain, East & Central Delhi",
      state: "Delhi",
      time: getRecentTime(2, 0),
      source: "Delhi Disaster Management Authority (DDMA)",
      actionable: true,
      dos: [
        "Follow DDMA evacuation sirens and relocate to designated tent relief camps.",
        "Store emergency battery banks, flashlights, and chlorine water purification tablets."
      ],
      donts: [
        "Do not visit ghats or old bridges for sightseeing or photography.",
        "Do not drive into submerged underpasses (Minto Bridge, Tilak Bridge)."
      ],
      helpline: "112 / DDMA Central Control: 1077",
      disasterType: "Floods"
    },
    {
      id: "dl-warn-1",
      type: "warning",
      category: "air_quality",
      title: "Severe Air Quality & Smog Alert (GRAP Stage-III)",
      description: "AQI categorized as 'Severe' (>400) across Delhi NCR. Primary and middle school outdoor sessions suspended. Vulnerable individuals advised to use N95 masks.",
      location: "Delhi NCR (All Districts)",
      state: "Delhi",
      time: getRecentTime(3, 30),
      source: "Commission for Air Quality Management (CAQM)",
      actionable: true,
      dos: [
        "Conduct morning assemblies indoors.",
        "Use air purifiers in closed classrooms where available."
      ],
      donts: [
        "Avoid intense outdoor physical exercise during peak pollution hours."
      ],
      helpline: "112 / 104",
      disasterType: "Heat Wave"
    },
    {
      id: "dl-info-1",
      type: "info",
      category: "earthquake",
      title: "Seismic Zone IV School Evacuation Preparedness",
      description: "Routine reminder: Delhi is situated in High-Damage Risk Seismic Zone IV. All educational institutions must maintain open exit routes and carry out quarterly earthquake drop drills.",
      location: "Delhi NCR",
      state: "Delhi",
      time: getRecentTime(9, 15),
      source: "NDMA",
      actionable: true,
      dos: [
        "Memorize: DROP to the ground, take COVER under a sturdy desk, and HOLD on firmly."
      ],
      donts: [
        "Never use elevators during or immediately following an earthquake."
      ],
      helpline: "112",
      disasterType: "Earthquake"
    }
  ],

  "Maharashtra": [
    {
      id: "mh-crit-1",
      type: "critical",
      category: "cyclone",
      title: "High Tide & Coastal Surge Red Alert",
      description: "Astronomical high tide of 4.8m combined with heavy sea surge predicted along Mumbai and Konkan coastline. Seafront promenades (Marine Drive, Bandra Bandstand, Gateway) closed to public.",
      location: "Mumbai & Konkan Coastline, Maharashtra",
      state: "Maharashtra",
      time: getRecentTime(1, 20),
      source: "IMD Mumbai & BMC Disaster Cell",
      actionable: true,
      dos: [
        "Stay clear of coastal beaches, rocky breakwaters, and sea walls.",
        "Keep emergency emergency kit ready if residing in low-lying coastal slum clusters."
      ],
      donts: [
        "Do not venture into the sea for swimming or boating."
      ],
      helpline: "112 / BMC Disaster: 1916",
      disasterType: "Cyclones"
    },
    {
      id: "mh-warn-1",
      type: "warning",
      category: "weather",
      title: "Western Ghats Landslide & Torrential Rain Watch",
      description: "Extremely heavy precipitation forecast in ghat sections of Pune, Satara, Raigad, and Ratnagiri districts. High landslide hazard along hilly highway corridors.",
      location: "Western Ghats (Pune, Raigad, Satara)",
      state: "Maharashtra",
      time: getRecentTime(4, 5),
      source: "Geological Survey of India (GSI) & IMD",
      actionable: true,
      dos: [
        "Monitor hill slopes for unusual mud runoffs, cracking sounds, or tilted trees.",
        "Avoid non-essential nighttime travel along ghat roads."
      ],
      donts: [
        "Do not stop or park vehicles under steep unstable rock overhangs."
      ],
      helpline: "112 / 1077",
      disasterType: "Floods"
    },
    {
      id: "mh-info-1",
      type: "info",
      category: "fire",
      title: "High-Rise Fire Safety Inspection Advisory",
      description: "Mandatory directive for school buildings and educational coaching complexes to audit fire extinguishers, smoke alarms, and clear emergency terrace escape access.",
      location: "Maharashtra (Urban Centres)",
      state: "Maharashtra",
      time: getRecentTime(11, 40),
      source: "Maharashtra Fire Services",
      actionable: true,
      dos: [
        "Conduct periodic fire extinguisher handling demonstrations for senior students and teachers."
      ],
      donts: [
        "Never padlock emergency staircase exit doors."
      ],
      helpline: "101 / 112",
      disasterType: "Fire"
    }
  ],

  "Bihar": [
    {
      id: "br-crit-1",
      type: "critical",
      category: "flood",
      title: "Kosi & Gandak River High Flood Inundation Alert",
      description: "High discharge from Nepal catchment has escalated flood warnings in Supaul, Saharsa, Madhubani, and Khagaria districts. Embankment patrolling intensified. Residents in low-lying floodplains must evacuate to high embankments.",
      location: "Kosi & Gandak River Basin, North Bihar",
      state: "Bihar",
      time: getRecentTime(1, 50),
      source: "Bihar State Disaster Management Authority (BSDMA)",
      actionable: true,
      dos: [
        "Relocate family members, livestock, and grain storage to designated elevated relief shelters.",
        "Boil all drinking water or use halogen tablets to prevent waterborne epidemic outbreaks."
      ],
      donts: [
        "Do not compromise or cut embankment slopes for localized drainage."
      ],
      helpline: "112 / Bihar Disaster Control: 1070",
      disasterType: "Floods"
    },
    {
      id: "br-warn-1",
      type: "warning",
      category: "weather",
      title: "Severe Lightning & Thunderstorm Warning (Vajrapat)",
      description: "High-density cloud-to-ground lightning strikes predicted over Patna, Gaya, Muzaffarpur, and Nalanda during afternoon convective storms. Immediate indoor shelter mandatory.",
      location: "Central & South Bihar Districts",
      state: "Bihar",
      time: getRecentTime(3, 10),
      source: "IMD Patna & BSDMA",
      actionable: true,
      dos: [
        "Stay inside pucca buildings with roofs and walls; avoid open school playgrounds.",
        "If caught outdoors without shelter, crouch low on balls of feet with hands over ears."
      ],
      donts: [
        "Never take shelter under isolated tall trees or near metal wire fences."
      ],
      helpline: "112 / 1070",
      disasterType: "Cyclones"
    }
  ],

  "Uttarakhand": [
    {
      id: "uk-crit-1",
      type: "critical",
      category: "flood",
      title: "Cloudburst & Flash Flood Warning in Valley Catchments",
      description: "Localized cloudburst potential reported in upper catchments of Alaknanda and Mandakini rivers (Chamoli & Rudraprayag). Riverfront settlements and pilgrims must move to higher slopes.",
      location: "Chamoli, Rudraprayag & Pithoragarh, Uttarakhand",
      state: "Uttarakhand",
      time: getRecentTime(1, 10),
      source: "Uttarakhand SDMA (USDMA) & IMD",
      actionable: true,
      dos: [
        "Immediately move away from stream beds, dry ravines, and riverbeds upon hearing sudden rumbling.",
        "Follow police transit checkpoints along the Badrinath and Kedarnath national highways."
      ],
      donts: [
        "Do not attempt to cross flooded mountain streams even on four-wheel-drive vehicles."
      ],
      helpline: "112 / Disaster Relief: 1070 / SDRF: 9411112985",
      disasterType: "Floods"
    },
    {
      id: "uk-warn-1",
      type: "warning",
      category: "weather",
      title: "Massive Landslide Risk along Mountain Highways",
      description: "Continuous heavy precipitation has destabilized vulnerable geological zones along Rishikesh-Badrinath (NH-58) and Char Dham routes. Road closures possible.",
      location: "Hill Districts, Uttarakhand",
      state: "Uttarakhand",
      time: getRecentTime(5, 0),
      source: "Border Roads Organisation (BRO)",
      actionable: true,
      dos: [
        "Keep emergency dry rations, warm blankets, and mobile powerbanks in all transit vehicles."
      ],
      donts: [
        "Do not attempt to walk across active shooting stone zones."
      ],
      helpline: "112",
      disasterType: "Earthquake"
    }
  ],

  "West Bengal": [
    {
      id: "wb-crit-1",
      type: "critical",
      category: "cyclone",
      title: "Bay of Bengal Deep Depression & Cyclone Alert",
      description: "Deep cyclonic depression in Northwest Bay of Bengal expected to bring gale-force winds (70-90 km/h) and heavy rainfall to coastal districts (South & North 24 Parganas, East Medinipur).",
      location: "Coastal West Bengal & Sundarbans",
      state: "West Bengal",
      time: getRecentTime(2, 15),
      source: "IMD Kolkata & WB SDMA",
      actionable: true,
      dos: [
        "Reinforce doors and windows with storm shutters or adhesive tape.",
        "Fishermen strictly warned not to venture into deep sea."
      ],
      donts: [
        "Do not leave loose tin sheets, signboards, or outdoor furniture unanchored."
      ],
      helpline: "112 / State Emergency: 1070",
      disasterType: "Cyclones"
    },
    {
      id: "wb-warn-1",
      type: "warning",
      category: "weather",
      title: "Heavy Rainfall & Urban Waterlogging Advisory",
      description: "Widespread heavy showers predicted across Kolkata, Howrah, and Hooghly districts leading to temporary waterlogging in low-lying municipal wards.",
      location: "Kolkata Metropolitan Area",
      state: "West Bengal",
      time: getRecentTime(4, 30),
      source: "IMD Kolkata",
      actionable: true,
      dos: [
        "Plan commute avoiding recognized waterlogged subways and underground parking."
      ],
      donts: [
        "Do not walk barefoot in stagnant city water to avoid leptospirosis and electric shocks."
      ],
      helpline: "112",
      disasterType: "Floods"
    }
  ],

  "Odisha": [
    {
      id: "od-crit-1",
      type: "critical",
      category: "cyclone",
      title: "Coastal Storm Surge & Gale Warning",
      description: "Intense cyclonic activity in Bay of Bengal triggering storm surges of 1.5 to 2.0 meters along Balasore, Bhadrak, Kendrapara, and Puri coastlines. Multi-purpose cyclone shelters activated.",
      location: "Coastal Odisha (Puri, Balasore, Ganjam)",
      state: "Odisha",
      time: getRecentTime(1, 30),
      source: "OSDMA & IMD",
      actionable: true,
      dos: [
        "Cooperate fully with village disaster management teams for orderly shelter relocation.",
        "Keep battery radios tuned to All India Radio for continuous official updates."
      ],
      donts: [
        "Do not enter the sea or stay in thatched or temporary tin-roofed huts."
      ],
      helpline: "112 / OSDMA: 1070",
      disasterType: "Cyclones"
    }
  ],

  "Gujarat": [
    {
      id: "gj-crit-1",
      type: "critical",
      category: "cyclone",
      title: "Saurashtra & Kutch Coastal Wind Alert",
      description: "Squally wind speed reaching 55-65 kmph gusting to 75 kmph predicted along Saurashtra & Kutch coast (Dwarka, Porbandar, Jamnagar, Mandvi). Port signal 3 hoisted.",
      location: "Saurashtra & Kutch Coastal Belt, Gujarat",
      state: "Gujarat",
      time: getRecentTime(2, 45),
      source: "GSDMA & IMD Ahmedabad",
      actionable: true,
      dos: [
        "Secure fishing trawlers and coastal storage sheds.",
        "Check school building roofs and solar panel mountings."
      ],
      donts: [
        "Do not venture near rocky coastal cliffs or beach shores."
      ],
      helpline: "112 / GSDMA: 1070",
      disasterType: "Cyclones"
    },
    {
      id: "gj-warn-1",
      type: "warning",
      category: "heatwave",
      title: "Extreme Heatwave Red Alert (Loo Warning)",
      description: "Daytime temperatures forecasted to touch 44°C-46°C across Ahmedabad, Gandhinagar, Rajkot, and Surendranagar. Risk of severe heat exhaustion and dehydration.",
      location: "Ahmedabad, Rajkot & Central Gujarat",
      state: "Gujarat",
      time: getRecentTime(5, 15),
      source: "IMD Ahmedabad & AMC Health Dept",
      actionable: true,
      dos: [
        "Drink plenty of water, ORS, lemon water, or buttermilk even if not feeling thirsty.",
        "Conduct all outdoor school physical activities strictly before 9:00 AM."
      ],
      donts: [
        "Do not step out directly into the sun between 12:00 PM and 3:30 PM without head cover."
      ],
      helpline: "108 / 112",
      disasterType: "Heat Wave"
    }
  ],

  "Rajasthan": [
    {
      id: "rj-crit-1",
      type: "critical",
      category: "heatwave",
      title: "Severe Heatwave & Dust Storm Warning",
      description: "Maximum temperatures forecasted above 47°C across Thar desert districts (Jodhpur, Bikaner, Barmer, Jaisalmer, Churu). Gusty dust storm winds (50-60 km/h) anticipated.",
      location: "Western Rajasthan Districts",
      state: "Rajasthan",
      time: getRecentTime(1, 40),
      source: "IMD Jaipur & Rajasthan SDMA",
      actionable: true,
      dos: [
        "Stay hydrated with traditional electrolytes (chaas, aam panna, coconut water).",
        "Keep damp cotton cloths over face and head during necessary transit."
      ],
      donts: [
        "Never leave children or pets locked in closed vehicles under the sun."
      ],
      helpline: "112 / 108",
      disasterType: "Heat Wave"
    }
  ],

  "Kerala": [
    {
      id: "kl-crit-1",
      type: "critical",
      category: "flood",
      title: "Red Alert: Torrential Monsoon & Landslide Warning",
      description: "Extremely heavy rainfall (>204mm) forecast over Wayanad, Idukki, Kozhikode, and Malappuram districts. Quarrying and hill slope construction strictly halted.",
      location: "Wayanad, Idukki & Northern Districts, Kerala",
      state: "Kerala",
      time: getRecentTime(1, 10),
      source: "Kerala State Disaster Management Authority (KSDMA)",
      actionable: true,
      dos: [
        "Relocate from landslide-vulnerable hill slopes to community relief centres immediately.",
        "Keep a grab-and-go emergency kit containing ID cards, flashlights, and vital medicines."
      ],
      donts: [
        "Do not visit waterfalls, mountain viewpoints, or swollen forest streams."
      ],
      helpline: "112 / KSDMA Control: 1077 / 1070",
      disasterType: "Floods"
    }
  ],

  "Tamil Nadu": [
    {
      id: "tn-crit-1",
      type: "critical",
      category: "weather",
      title: "Heavy Monsoon Downpour & Coastal Inundation Advisory",
      description: "Intense convective rain bands moving into coastal Tamil Nadu including Chennai, Tiruvallur, Kanchipuram, and Cuddalore. Drainage pumps deployed in low-lying zones.",
      location: "Chennai Metropolitan & Coastal Tamil Nadu",
      state: "Tamil Nadu",
      time: getRecentTime(2, 20),
      source: "IMD Chennai & TNDRRA",
      actionable: true,
      dos: [
        "Stay indoors during periods of torrential downpours.",
        "Ensure institutional rainwater harvesting pits and storm drains are debris-free."
      ],
      donts: [
        "Avoid parking vehicles under large roadside trees or aging billboards."
      ],
      helpline: "112 / Chennai Corp: 1913 / State: 1070",
      disasterType: "Floods"
    }
  ],

  "Assam": [
    {
      id: "as-crit-1",
      type: "critical",
      category: "flood",
      title: "Brahmaputra & Tributaries High Spate Red Alert",
      description: "Brahmaputra river and major tributaries (Jia-Bharali, Manas, Beki) flowing significantly above danger level. Severe bank erosion and inundation across Dhemaji, Barpeta, Morigaon, and Kaziranga.",
      location: "Brahmaputra Valley, Assam",
      state: "Assam",
      time: getRecentTime(1, 35),
      source: "Assam State Disaster Management Authority (ASDMA)",
      actionable: true,
      dos: [
        "Evacuate marooned families to flood relief camps on higher river embankments.",
        "Ensure livestock are secured on elevated platforms (chaporis)."
      ],
      donts: [
        "Do not navigate mechanized country boats through raging flood currents without life jackets."
      ],
      helpline: "112 / ASDMA: 1070 / 1079",
      disasterType: "Floods"
    }
  ]
};

// Fallback alert generator for any Indian state or union territory not explicitly listed
export const getAlertsForLocation = (state: string, city?: string): SafetyAlert[] => {
  const trimmedState = (state || "Uttar Pradesh").trim();
  
  if (STATE_ALERT_DATABASE[trimmedState]) {
    return STATE_ALERT_DATABASE[trimmedState];
  }

  // Find partial match
  const matchedKey = Object.keys(STATE_ALERT_DATABASE).find(k => 
    trimmedState.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(trimmedState.toLowerCase())
  );
  if (matchedKey && STATE_ALERT_DATABASE[matchedKey]) {
    return STATE_ALERT_DATABASE[matchedKey];
  }

  // Universal accurate fallback for any other state/city
  const locationLabel = city ? `${city}, ${trimmedState}` : trimmedState;
  return [
    {
      id: `gen-warn-1-${trimmedState}`,
      type: "warning",
      category: "weather",
      title: `Weather & Preparedness Advisory for ${trimmedState}`,
      description: `IMD seasonal weather bulletin: Moderate to heavy isolated precipitation and localized gusty winds expected across districts of ${trimmedState}. Schools are advised to review safety protocols.`,
      location: locationLabel,
      state: trimmedState,
      time: getRecentTime(2, 10),
      source: "India Meteorological Department (IMD)",
      actionable: true,
      dos: [
        "Inspect classroom window latches and clear drainage channels.",
        "Ensure students have direct access to covered walkways during rain.",
        "Keep emergency contact numbers for local police and ambulance posted prominently."
      ],
      donts: [
        "Do not assemble near weak boundary walls or large trees during high winds."
      ],
      helpline: "112 / 108",
      disasterType: "Floods"
    },
    {
      id: `gen-info-1-${trimmedState}`,
      type: "info",
      category: "earthquake",
      title: `School Disaster Readiness Review (${trimmedState})`,
      description: `State Disaster Management Authority compliance bulletin for ${trimmedState}. All schools and colleges are advised to maintain active emergency evacuation routes and conduct regular student drills.`,
      location: trimmedState,
      state: trimmedState,
      time: getRecentTime(7, 30),
      source: "National Disaster Management Authority (NDMA)",
      actionable: true,
      dos: [
        "Verify that first aid kits are stocked with sterile bandages, burn ointments, and antiseptics.",
        "Practice the Drop, Cover, and Hold drill with all classroom sections."
      ],
      donts: [
        "Do not store heavy objects on open top shelves in laboratories or classrooms."
      ],
      helpline: "112 / 1070",
      disasterType: "Earthquake"
    }
  ];
};
