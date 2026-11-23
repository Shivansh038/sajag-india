import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, Pause, Volume2, VolumeX, Heart, Share2, 
  MessageCircle, Bookmark, ChevronUp, ChevronDown,
  RotateCcw, BookOpen, Send, ShieldCheck, 
  Activity, ArrowRight, Check, Droplets, Thermometer, Wind, Waves,
  Video, ListChecks, Phone, ExternalLink, Info, AlertTriangle, CheckCircle2, Mountain
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Web Audio tone generator for 100% local, offline sound effects
const playTone = (freq: number, type: OscillatorType = "sine", duration = 0.25) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio context may be restricted by browser policy before first user interaction
  }
};

interface ReelStep {
  stepNumber: number;
  headline: string;
  instruction: string;
  tipType?: "action" | "warning" | "protip";
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timeAgo: string;
}

interface Reel {
  id: number;
  title: string;
  subtitle: string;
  disaster: "Earthquake" | "Landslide" | "Flood" | "Cyclone" | "Fire" | "Heat Wave" | "Tsunami";
  videoUrl: string;
  videoEmbedUrl: string;
  source: string;
  durationSeconds: number;
  themeGradient: string;
  accentColor: string;
  emoji: string;
  steps: ReelStep[];
  dos: string[];
  donts: string[];
  emergencyContact: string;
  defaultComments: Comment[];
  initialLikes: number;
  initialShares: number;
}

const REELS_DATA: Reel[] = [
  {
    id: 1,
    title: "How To Survive An Earthquake?",
    subtitle: "Rapid Tremor Action & Floor Drop Defense",
    disaster: "Earthquake",
    videoUrl: "https://www.youtube.com/shorts/Wd1sW6_VCU0",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/Wd1sW6_VCU0?autoplay=1&mute=1&loop=1&playlist=Wd1sW6_VCU0&controls=1&modestbranding=1&rel=0",
    source: "Earthquake Safety Quick Guide",
    durationSeconds: 30,
    themeGradient: "from-amber-950 via-stone-900 to-black",
    accentColor: "#f59e0b",
    emoji: "🫨",
    steps: [
      {
        stepNumber: 1,
        headline: "DROP to Floor",
        instruction: "Drop onto hands and knees immediately before violent tremors throw you off your feet.",
        tipType: "action"
      },
      {
        stepNumber: 2,
        headline: "COVER Head & Neck",
        instruction: "Shield yourself under a sturdy desk or interior wall to protect from falling lights and plaster.",
        tipType: "action"
      },
      {
        stepNumber: 3,
        headline: "HOLD ON Firmly",
        instruction: "Grasp shelter legs tightly and stay prepared to move with it until the shaking ceases.",
        tipType: "action"
      },
      {
        stepNumber: 4,
        headline: "Never Run Outside",
        instruction: "Exterior facades and glass cause 80% of injuries. Stay indoors until ground shaking stops.",
        tipType: "warning"
      }
    ],
    dos: [
      "Drop under a sturdy table, desk, or against an interior room corner",
      "Stay away from glass windows, heavy bookcases, and ceiling fixtures",
      "If outside, move immediately into open ground away from utility wires"
    ],
    donts: [
      "Do NOT run out of buildings during active ground shaking",
      "Do NOT use elevators or stand directly under doorway arches",
      "Do NOT light matches or lighters due to potential fractured gas pipes"
    ],
    emergencyContact: "112 / 1070 (Disaster Helpline)",
    defaultComments: [
      { id: "c1", author: "Aarav Sharma", text: "Short and super practical. Drop Cover Hold on works!", timeAgo: "1 hour ago" },
      { id: "c2", author: "Dr. Meera Iyer", text: "Make sure students protect the back of their neck with their arms.", timeAgo: "3 hours ago" }
    ],
    initialLikes: 3420,
    initialShares: 720
  },
  {
    id: 2,
    title: "How to Survive a Deadly Landslide 🏔️⚠️",
    subtitle: "Debris Flow Early Warning & Mountain Slope Escape",
    disaster: "Landslide",
    videoUrl: "https://www.youtube.com/shorts/6Ys0Qes7_M8",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/6Ys0Qes7_M8?autoplay=1&mute=1&loop=1&playlist=6Ys0Qes7_M8&controls=1&modestbranding=1&rel=0",
    source: "Geological Hazard Survival & NDMA Mountain Cell",
    durationSeconds: 35,
    themeGradient: "from-stone-950 via-emerald-950 to-black",
    accentColor: "#10b981",
    emoji: "🏔️",
    steps: [
      {
        stepNumber: 1,
        headline: "Detect Slope Movement",
        instruction: "Watch for tilting trees, jammed doors, or sudden new cracks in hillside foundations and roads.",
        tipType: "warning"
      },
      {
        stepNumber: 2,
        headline: "Listen for Low Rumble",
        instruction: "Landslides and debris flows produce a distinct freight-train roar as mud and boulders tumble.",
        tipType: "warning"
      },
      {
        stepNumber: 3,
        headline: "Run PERPENDICULAR to Flow",
        instruction: "Never run straight downhill in front of the slide! Run sideways/perpendicular across the slope.",
        tipType: "action"
      },
      {
        stepNumber: 4,
        headline: "Curl into a Tight Ball",
        instruction: "If escape is impossible, curl into a tight fetal ball and protect your head with your arms.",
        tipType: "protip"
      }
    ],
    dos: [
      "Stay alert during heavy monsoon downpours in hilly and mountainous terrain",
      "Evacuate immediately if you notice cracking soil, bulging slopes, or sudden muddy stream surges",
      "Run sideways across the slope rather than downhill in the path of debris"
    ],
    donts: [
      "Do NOT cross bridges over swollen mountain streams if rolling boulders or debris are visible",
      "Do NOT shelter in low-lying valley gullies during intense mountain rainstorms",
      "Do NOT return to evacuated slope structures until certified safe by geologists"
    ],
    emergencyContact: "112 / 1077 (District Emergency Center)",
    defaultComments: [
      { id: "c3", author: "Pooja Verma", text: "Crucial for Uttarakhand and Himachal Pradesh during monsoon season!", timeAgo: "2 hours ago" },
      { id: "c4", author: "Capt. Anand", text: "Running perpendicular to the slide direction is the #1 rule that saves lives.", timeAgo: "5 hours ago" }
    ],
    initialLikes: 4180,
    initialShares: 890
  },
  {
    id: 3,
    title: "How to Survive a Tsunami",
    subtitle: "Ocean Retreat Warning Signs & High-Elevation Action",
    disaster: "Tsunami",
    videoUrl: "https://www.youtube.com/shorts/x6AZOMVGHps",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/x6AZOMVGHps?autoplay=1&mute=1&loop=1&playlist=x6AZOMVGHps&controls=1&modestbranding=1&rel=0",
    source: "How Would You Do It? Survival Series",
    durationSeconds: 47,
    themeGradient: "from-teal-950 via-cyan-950 to-black",
    accentColor: "#06b6d4",
    emoji: "🌊",
    steps: [
      {
        stepNumber: 1,
        headline: "Notice Rapid Sea Drawdown",
        instruction: "If the ocean suddenly retreats exposing dry seabed and flopping fish, a massive tsunami wave is minutes away.",
        tipType: "warning"
      },
      {
        stepNumber: 2,
        headline: "Never Walk on Exposed Sand",
        instruction: "Do NOT walk toward the ocean or stay to film videos; the exposed seafloor is a death trap.",
        tipType: "warning"
      },
      {
        stepNumber: 3,
        headline: "Sprint to High Ground",
        instruction: "Run inland immediately at least 1-2 km or climb at least 100+ feet above sea level.",
        tipType: "action"
      },
      {
        stepNumber: 4,
        headline: "Await Official All-Clear",
        instruction: "Multiple surging waves arrive over several hours; never return to the shoreline after the first wave.",
        tipType: "protip"
      }
    ],
    dos: [
      "Head immediately inland and uphill to the highest available terrain or concrete structure",
      "Listen for coastal sirens and early INCOIS warning broadcasts",
      "Abandon vehicles caught in traffic and continue uphill on foot"
    ],
    donts: [
      "Do NOT go to the beach or shoreline to watch or film incoming tsunami surges",
      "Do NOT return to low-lying coastal areas until emergency services give full clearance",
      "Do NOT attempt to ride out a tsunami in coastal boats or small harbors"
    ],
    emergencyContact: "1070 (Disaster Helpline) / 112",
    defaultComments: [
      { id: "c5", author: "Arjun Nair", text: "People in 2004 walked out to see the exposed seabed not knowing what was coming. Vital video!", timeAgo: "1 hour ago" },
      { id: "c6", author: "Divya Rao", text: "Always remember: First wave is never the biggest wave.", timeAgo: "4 hours ago" }
    ],
    initialLikes: 5120,
    initialShares: 1140
  },
  {
    id: 4,
    title: "What To Do If House Floods",
    subtitle: "Indoor Flood Defense, Power Isolation & Roof Escape",
    disaster: "Flood",
    videoUrl: "https://www.youtube.com/shorts/dromoa7VDqI",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/dromoa7VDqI?autoplay=1&mute=1&loop=1&playlist=dromoa7VDqI&controls=1&modestbranding=1&rel=0",
    source: "Emergency Flood Defense Protocols",
    durationSeconds: 30,
    themeGradient: "from-blue-950 via-indigo-950 to-black",
    accentColor: "#3b82f6",
    emoji: "🏠",
    steps: [
      {
        stepNumber: 1,
        headline: "Cut Main Power Switch",
        instruction: "Locate fuse box and immediately turn off mains before water touches electrical outlets to prevent electrocution.",
        tipType: "action"
      },
      {
        stepNumber: 2,
        headline: "Move to Upper Floor",
        instruction: "If water rushes into ground level, head upstairs immediately before currents make stairwells impassable.",
        tipType: "action"
      },
      {
        stepNumber: 3,
        headline: "Avoid Sealed Attics",
        instruction: "Do NOT get trapped in an attic without an escape route; take a tool to break out onto the roof if water rises.",
        tipType: "warning"
      },
      {
        stepNumber: 4,
        headline: "Signal for Rescue",
        instruction: "Wave bright clothing, a whistle, or flashlight from the roof so NDRF rescue boats can locate you.",
        tipType: "protip"
      }
    ],
    dos: [
      "Shut off main electricity, gas, and water supply valves before water rises",
      "Move children, elderly family members, and essential medicines upstairs immediately",
      "Bring emergency flashlight, whistle, and fully charged mobile phone into upper shelter"
    ],
    donts: [
      "Do NOT touch electric appliances, switches, or submerged cords while standing in water",
      "Do NOT climb into a closed attic without an axe or hammer to cut through the roof",
      "Do NOT attempt to swim through rushing ground-floor flood currents"
    ],
    emergencyContact: "1070 (Disaster Relief) / 108",
    defaultComments: [
      { id: "c7", author: "Kunal Ghosh", text: "The warning about sealed attics is so important. Rising water can trap you under the ceiling.", timeAgo: "3 hours ago" },
      { id: "c8", author: "Sneha Sen", text: "Switching off the mains early prevents lethal electrical shorts.", timeAgo: "6 hours ago" }
    ],
    initialLikes: 4680,
    initialShares: 980
  },
  {
    id: 5,
    title: "Cyclone Eye & Gale Tactics",
    subtitle: "Severe Storm Defense & Evacuation Protocols",
    disaster: "Cyclone",
    videoUrl: "https://www.youtube.com/watch?v=14QOq_ZpD0g",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/14QOq_ZpD0g?autoplay=1&mute=1&loop=1&playlist=14QOq_ZpD0g&controls=1&modestbranding=1&rel=0",
    source: "IMD & NDMA Cyclone Defense Protocols",
    durationSeconds: 30,
    themeGradient: "from-purple-950 via-indigo-950 to-black",
    accentColor: "#a855f7",
    emoji: "🌀",
    steps: [
      {
        stepNumber: 1,
        headline: "Secure Indoors Early",
        instruction: "Shutter windows, anchor outdoor tin sheds and loose objects, and switch off gas mains before gale winds intensify.",
        tipType: "action"
      },
      {
        stepNumber: 2,
        headline: "Windowless Safe Room",
        instruction: "Shelter in an interior room, central hallway, or under concrete stairs on the lowest floor away from exterior glass.",
        tipType: "action"
      },
      {
        stepNumber: 3,
        headline: "Beware of The 'Eye'",
        instruction: "The calm center is deceptive! As the cyclone eye passes, violent 150+ km/h hurricane winds will abruptly strike from the opposite side.",
        tipType: "warning"
      },
      {
        stepNumber: 4,
        headline: "Listen to Official Radio",
        instruction: "Cellular networks frequently collapse. Keep battery-powered radios tuned to All India Radio or official NDMA alerts.",
        tipType: "protip"
      }
    ],
    dos: [
      "Keep emergency go-bags with battery torches, dry food, and identification documents ready",
      "Stay indoors until an official all-clear is announced by disaster relief authorities",
      "Disconnect all heavy electronic appliances to prevent lightning surges"
    ],
    donts: [
      "Do NOT step outside during the temporary calm eye of the cyclone",
      "Do NOT shelter under tin roofs, hoardings, or decaying large trees",
      "Do NOT spread unverified rumors on social messaging channels"
    ],
    emergencyContact: "1077 (District Disaster Centre)",
    defaultComments: [
      { id: "c10", author: "Kavita Nair", text: "Lived through Cyclone Fani in Odisha. The eye warning is 100% accurate!", timeAgo: "3 hours ago" }
    ],
    initialLikes: 2150,
    initialShares: 410
  },
  {
    id: 6,
    title: "Stop, Drop, Roll & Low Crawl",
    subtitle: "School & Home Fire Evacuation Action Drill",
    disaster: "Fire",
    videoUrl: "https://www.youtube.com/watch?v=gC34wB88_V8",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/gC34wB88_V8?autoplay=1&mute=1&loop=1&playlist=gC34wB88_V8&controls=1&modestbranding=1&rel=0",
    source: "Delhi Fire Service & Red Cross Emergency Response",
    durationSeconds: 28,
    themeGradient: "from-red-950 via-orange-950 to-black",
    accentColor: "#ef4444",
    emoji: "🔥",
    steps: [
      {
        stepNumber: 1,
        headline: "If Clothes Catch Fire",
        instruction: "STOP running, DROP flat to the ground, cover your face with hands, and ROLL back and forth to extinguish flames.",
        tipType: "action"
      },
      {
        stepNumber: 2,
        headline: "CRAWL Low Under Smoke",
        instruction: "Toxic gases and superheated smoke rise to the ceiling. Crawl on hands and knees where cleaner air stays near the floor.",
        tipType: "action"
      },
      {
        stepNumber: 3,
        headline: "Feel Doors with Back of Hand",
        instruction: "Touch door handles with the BACK of your hand. If hot, fire is directly outside — do not open; use another exit.",
        tipType: "warning"
      },
      {
        stepNumber: 4,
        headline: "Never Use Elevators",
        instruction: "Power failure can trap you in the shaft, which acts as a smoke chimney. Always use designated fire escape stairs.",
        tipType: "protip"
      }
    ],
    dos: [
      "Crawl low under smoke with a damp cloth covering your nose and mouth",
      "Close doors behind you as you evacuate to slow fire spread",
      "Know at least two unobstructed emergency exit routes from every room"
    ],
    donts: [
      "Do NOT use elevators during any fire alarm",
      "Do NOT go back inside for laptops, bags, or pets once outside",
      "Do NOT touch hot metal door knobs with your palm"
    ],
    emergencyContact: "101 (Fire Emergency) / 112",
    defaultComments: [
      { id: "c11", author: "Capt. Rajesh", text: "As a firefighter, please remember: Never go back inside for personal belongings!", timeAgo: "1 day ago" }
    ],
    initialLikes: 2790,
    initialShares: 580
  },
  {
    id: 7,
    title: "Beat The Heat: Heatwave Defense",
    subtitle: "Severe Heatstroke Prevention & Electrolyte Guide",
    disaster: "Heat Wave",
    videoUrl: "https://www.youtube.com/watch?v=gK6w7i6c7zE",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/gK6w7i6c7zE?autoplay=1&mute=1&loop=1&playlist=gK6w7i6c7zE&controls=1&modestbranding=1&rel=0",
    source: "Ministry of Health & NDMA Heat Action Plan",
    durationSeconds: 26,
    themeGradient: "from-orange-950 via-amber-950 to-black",
    accentColor: "#f97316",
    emoji: "🥵",
    steps: [
      {
        stepNumber: 1,
        headline: "Drink Electrolytes Regularly",
        instruction: "Drink water, ORS solution, lemon water, and buttermilk every 20-30 minutes, even if you do not feel thirsty.",
        tipType: "action"
      },
      {
        stepNumber: 2,
        headline: "Avoid Peak Sun Hours",
        instruction: "Stay indoors between 12:00 PM and 3:30 PM. Wear light-colored, loose cotton clothing and wide-brim hats outside.",
        tipType: "warning"
      },
      {
        stepNumber: 3,
        headline: "Recognize Heatstroke",
        instruction: "High body temperature (>103°F), confusion, dry red skin without sweating, and dizziness are life-threatening medical emergencies.",
        tipType: "warning"
      },
      {
        stepNumber: 4,
        headline: "First Aid for Heat Collapse",
        instruction: "Move victim to shaded breeze immediately, apply cold wet towels to neck, armpits, and groin, and call 108 ambulance.",
        tipType: "protip"
      }
    ],
    dos: [
      "Carry water bottles and oral rehydration salts (ORS) whenever traveling outdoors",
      "Keep domestic pets in well-ventilated, shaded spaces with plenty of cool water",
      "Cover your head with a damp towel, scarf, or umbrella under direct sun"
    ],
    donts: [
      "Do NOT leave children or pets inside parked closed vehicles even for 2 minutes",
      "Do NOT consume caffeinated sodas or heavy fried foods during peak heat hours",
      "Do NOT engage in strenuous physical sports under direct midday sun"
    ],
    emergencyContact: "108 (Emergency Ambulance)",
    defaultComments: [
      { id: "c12", author: "Dr. Ananya Sen", text: "Crucial for North Indian summers where temperatures cross 45°C. Stay hydrated!", timeAgo: "4 hours ago" }
    ],
    initialLikes: 1910,
    initialShares: 320
  },
  {
    id: 8,
    title: "How to Survive the Flood?? EP001",
    subtitle: "Rapid Water Surge Survival & Urban Flood Escapes",
    disaster: "Flood",
    videoUrl: "https://www.youtube.com/shorts/85MlCwLx9Ms",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/85MlCwLx9Ms?autoplay=1&mute=1&loop=1&playlist=85MlCwLx9Ms&controls=1&modestbranding=1&rel=0",
    source: "Whatif Survival Series",
    durationSeconds: 35,
    themeGradient: "from-blue-950 via-cyan-950 to-black",
    accentColor: "#0ea5e9",
    emoji: "🌊",
    steps: [
      {
        stepNumber: 1,
        headline: "Recognize Flash Flood Velocity",
        instruction: "Moving floodwaters accelerate rapidly. Never underestimate shallow water—just 6 inches of swift flow can sweep adults off their feet.",
        tipType: "warning"
      },
      {
        stepNumber: 2,
        headline: "Turn Around, Don't Drown",
        instruction: "Never drive or walk across flooded roadways or underpasses. Water conceals washed-out bridges, sinkholes, and open manholes.",
        tipType: "action"
      },
      {
        stepNumber: 3,
        headline: "Evacuate Basements Early",
        instruction: "Do NOT linger in basement apartments or underground garages during cloudbursts; they can flood to ceiling height in under 3 minutes.",
        tipType: "action"
      },
      {
        stepNumber: 4,
        headline: "Climb & Signal Rescuers",
        instruction: "If trapped indoors, climb to the roof or upper floor with a flashlight or bright cloth to signal SDRF / NDRF evacuation teams.",
        tipType: "protip"
      }
    ],
    dos: [
      "Move to higher ground immediately when heavy rainfall or flash flood alerts sound",
      "Keep an emergency waterproof go-bag with medication, torch, and power bank ready",
      "Follow designated flood evacuation routes mapped by local municipal authorities"
    ],
    donts: [
      "Do NOT attempt to drive vehicles through flooded roads or underpasses",
      "Do NOT touch downed electric wires or walk near submerged transformer boxes",
      "Do NOT swim in swift-flowing muddy floodwaters"
    ],
    emergencyContact: "1070 (State Relief) / 112",
    defaultComments: [
      { id: "c13", author: "Rohan Verma", text: "Turn Around Don't Drown is the most vital rule in city flash floods!", timeAgo: "1 hour ago" },
      { id: "c14", author: "Priya Nair", text: "Underground parking fills up shockingly fast. Great practical advice.", timeAgo: "2 hours ago" }
    ],
    initialLikes: 3890,
    initialShares: 740
  },
  {
    id: 9,
    title: "The One Room That Could Save Your Life in a Cyclone",
    subtitle: "Safest Interior Shelter Zone & Flying Debris Defense",
    disaster: "Cyclone",
    videoUrl: "https://www.youtube.com/shorts/9mPBfK1w68I",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/9mPBfK1w68I?autoplay=1&mute=1&loop=1&playlist=9mPBfK1w68I&controls=1&modestbranding=1&rel=0",
    source: "Quark to Coast Survival Series",
    durationSeconds: 40,
    themeGradient: "from-indigo-950 via-slate-900 to-black",
    accentColor: "#818cf8",
    emoji: "🌀",
    steps: [
      {
        stepNumber: 1,
        headline: "Locate the Central Windowless Room",
        instruction: "Choose an interior room on the lowest floor with no exterior glass (such as a central bathroom, hallway, or fortified pantry).",
        tipType: "action"
      },
      {
        stepNumber: 2,
        headline: "Shield Against Flying Projectiles",
        instruction: "Gale-force winds turn roof tiles and debris into deadly missiles. An interior bathroom provides multiple reinforced wall barriers.",
        tipType: "warning"
      },
      {
        stepNumber: 3,
        headline: "Fortify with Heavy Mattresses",
        instruction: "Take sturdy mattresses, thick quilts, or pillows into the room and pull them over your body to protect from falling ceiling debris.",
        tipType: "action"
      },
      {
        stepNumber: 4,
        headline: "Stay Put Through the Eye",
        instruction: "Do NOT leave when winds abruptly stop—the eye is calm, but the opposite eyewall will strike suddenly with fierce intensity.",
        tipType: "protip"
      }
    ],
    dos: [
      "Shelter in a small, central, windowless ground-floor room before landfall",
      "Cover yourself and family members with heavy mattresses or helmets for impact defense",
      "Keep an emergency radio, drinking water, and first aid kit inside your safe room"
    ],
    donts: [
      "Do NOT remain near large glass windows, balconies, or French doors",
      "Do NOT step outside during the deceptively calm eye of the storm",
      "Do NOT shelter in tin-roofed or temporary sheds"
    ],
    emergencyContact: "1077 (District Relief) / 112",
    defaultComments: [
      { id: "c15", author: "Ananya Deshmukh", text: "An interior bathroom with no windows saved our family during Cyclone Biparjoy!", timeAgo: "2 hours ago" },
      { id: "c16", author: "Rajesh K.", text: "Plumbing pipes and compact walls make interior bathrooms structurally the safest zone.", timeAgo: "3 hours ago" }
    ],
    initialLikes: 4520,
    initialShares: 910
  }
];

interface ReelsProps {
  onNavigate?: (screen: string) => void;
}

const Reels = ({ onNavigate }: ReelsProps) => {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"video" | "steps">("video");
  const [isVoiceNarratorEnabled, setIsVoiceNarratorEnabled] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Interaction states stored per reel
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});
  const [likesCountMap, setLikesCountMap] = useState<Record<number, number>>({});
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<number, boolean>>({});
  const [commentsMap, setCommentsMap] = useState<Record<number, Comment[]>>({});

  // Modals
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");

  const { toast } = useToast();
  const currentReel = REELS_DATA[currentReelIndex];

  // Load saved state
  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem("sajag_reel_likes");
      if (savedLikes) setLikedMap(JSON.parse(savedLikes));

      const savedBookmarks = localStorage.getItem("sajag_reel_bookmarks");
      if (savedBookmarks) setBookmarkedMap(JSON.parse(savedBookmarks));

      const savedComments = localStorage.getItem("sajag_reel_comments");
      if (savedComments) setCommentsMap(JSON.parse(savedComments));
    } catch (e) {
      console.warn("Could not load interactions", e);
    }

    const counts: Record<number, number> = {};
    REELS_DATA.forEach(r => { counts[r.id] = r.initialLikes; });
    setLikesCountMap(counts);
  }, []);

  // Change Reel handler
  const handleSelectReel = useCallback((index: number) => {
    if (index >= 0 && index < REELS_DATA.length) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setCurrentReelIndex(index);
      setActiveStepIndex(0);
    }
  }, []);

  const handleNextReel = () => {
    if (currentReelIndex < REELS_DATA.length - 1) {
      handleSelectReel(currentReelIndex + 1);
    } else {
      handleSelectReel(0);
    }
  };

  const handlePrevReel = () => {
    if (currentReelIndex > 0) {
      handleSelectReel(currentReelIndex - 1);
    }
  };

  // Voice Narration
  const toggleVoiceNarration = () => {
    const next = !isVoiceNarratorEnabled;
    setIsVoiceNarratorEnabled(next);
    
    if (next && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const currentStep = currentReel.steps[activeStepIndex] || currentReel.steps[0];
      const text = `${currentReel.title}. Step ${currentStep.stepNumber}: ${currentStep.headline}. ${currentStep.instruction}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
      toast({
        title: "🔊 Voiceover Enabled",
        description: "Reciting disaster safety protocols.",
      });
    } else if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Likes toggle
  const handleToggleLike = () => {
    const reelId = currentReel.id;
    const isCurrentlyLiked = !!likedMap[reelId];
    const newLiked = !isCurrentlyLiked;
    
    playTone(newLiked ? 523.25 : 392, "sine", 0.15);
    const updatedMap = { ...likedMap, [reelId]: newLiked };
    setLikedMap(updatedMap);
    
    setLikesCountMap(prev => ({
      ...prev,
      [reelId]: (prev[reelId] || currentReel.initialLikes) + (newLiked ? 1 : -1)
    }));

    try {
      localStorage.setItem("sajag_reel_likes", JSON.stringify(updatedMap));
    } catch (e) {
      console.warn(e);
    }

    if (newLiked) {
      toast({
        title: "❤️ Video Liked!",
        description: `Saved to your liked preparedness reels.`,
      });
    }
  };

  // Bookmark toggle
  const handleToggleBookmark = () => {
    const reelId = currentReel.id;
    const isCurrentlyBookmarked = !!bookmarkedMap[reelId];
    const newBookmarked = !isCurrentlyBookmarked;

    playTone(440, "sine", 0.15);
    const updated = { ...bookmarkedMap, [reelId]: newBookmarked };
    setBookmarkedMap(updated);

    try {
      localStorage.setItem("sajag_reel_bookmarks", JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    toast({
      title: newBookmarked ? "🔖 Video Bookmarked" : "Removed from Bookmarks",
      description: newBookmarked ? "Saved to your offline emergency library." : undefined,
    });
  };

  // Share reel
  const handleShareReel = async () => {
    playTone(493.88, "sine", 0.2);
    const shareText = `🚨 Sajag Disaster Preparedness Video: "${currentReel.title}"\n${currentReel.subtitle}\nKey Action: ${currentReel.steps[0].headline} - ${currentReel.steps[0].instruction}\nWatch on Sajag India!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentReel.title,
          text: shareText,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "📋 Video Link Copied!",
        description: "Survival video and safety takeaways copied to clipboard.",
      });
    }
  };

  // Submit comment
  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const reelId = currentReel.id;
    const currentList = commentsMap[reelId] || currentReel.defaultComments;
    
    const newC: Comment = {
      id: "usr_" + Date.now(),
      author: "You (Student)",
      text: newCommentText.trim(),
      timeAgo: "Just now"
    };

    const updatedList = [newC, ...currentList];
    const updatedMap = { ...commentsMap, [reelId]: updatedList };
    setCommentsMap(updatedMap);
    setNewCommentText("");

    try {
      localStorage.setItem("sajag_reel_comments", JSON.stringify(updatedMap));
    } catch (e) {
      console.warn(e);
    }

    playTone(659.25, "sine", 0.2);
    toast({
      title: "💬 Comment Posted!",
      description: "Your safety takeaway has been added to the discussion.",
    });
  };

  const currentComments = commentsMap[currentReel.id] || currentReel.defaultComments;
  const isLiked = !!likedMap[currentReel.id];
  const isBookmarked = !!bookmarkedMap[currentReel.id];
  const currentLikes = likesCountMap[currentReel.id] || currentReel.initialLikes;
  const activeStep = currentReel.steps[activeStepIndex] || currentReel.steps[0];

  return (
    <div className={`relative w-full h-[calc(100vh-60px)] max-h-[820px] bg-gradient-to-b ${currentReel.themeGradient} text-white flex flex-col justify-between overflow-hidden select-none`}>
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] pointer-events-none z-0" />

      {/* Top Header Controls */}
      <div className="relative z-30 px-3 pt-2 pb-1.5 flex flex-col gap-1.5 bg-gradient-to-b from-black/85 via-black/40 to-transparent">
        {/* Progress Bar across all Disaster Reels */}
        <div className="flex items-center gap-1 w-full">
          {REELS_DATA.map((r, idx) => (
            <button
              key={r.id}
              onClick={() => handleSelectReel(idx)}
              className={`flex-1 h-1 rounded-full transition-all ${
                idx === currentReelIndex 
                  ? "bg-white shadow-md shadow-white/40" 
                  : "bg-white/25 hover:bg-white/40"
              }`}
              title={r.title}
            />
          ))}
        </div>

        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-1.5">
            <Badge 
              variant="outline" 
              className="text-[11px] font-bold border-white/20 bg-black/50 text-white backdrop-blur-md px-2 py-0.5 flex items-center gap-1"
            >
              <span className="text-sm">{currentReel.emoji}</span>
              <span>{currentReel.disaster}</span>
            </Badge>

            {/* View Mode Toggle: Video vs Action Steps */}
            <div className="bg-black/60 rounded-full p-0.5 border border-white/15 flex items-center text-[10px]">
              <button
                onClick={() => setViewMode("video")}
                className={`px-2 py-0.5 rounded-full font-bold flex items-center gap-1 transition-all ${
                  viewMode === "video" ? "bg-primary text-white shadow-sm" : "text-white/70 hover:text-white"
                }`}
              >
                <Video className="w-3 h-3" />
                <span>Video</span>
              </button>
              <button
                onClick={() => setViewMode("steps")}
                className={`px-2 py-0.5 rounded-full font-bold flex items-center gap-1 transition-all ${
                  viewMode === "steps" ? "bg-primary text-white shadow-sm" : "text-white/70 hover:text-white"
                }`}
              >
                <ListChecks className="w-3 h-3" />
                <span>Action Plan</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Voiceover Toggle */}
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleVoiceNarration}
              className={`w-7 h-7 rounded-full border border-white/20 backdrop-blur-md ${
                isVoiceNarratorEnabled ? "bg-primary text-white" : "bg-black/40 text-white/80 hover:text-white"
              }`}
              title={isVoiceNarratorEnabled ? "Mute Voiceover" : "Enable Voiceover"}
            >
              {isVoiceNarratorEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </Button>

            {/* Emergency Info Modal Toggle */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsDetailsOpen(true)}
              className="w-7 h-7 rounded-full bg-black/40 border border-white/20 text-white/80 hover:text-white backdrop-blur-md"
              title="View Disaster Safety Guidelines"
            >
              <Info className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Center Stage: Video Player or Action Steps */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-3 overflow-hidden">
        {viewMode === "video" ? (
          <div className="w-full h-full flex flex-col justify-center items-center max-w-sm relative py-1">
            {/* Vertical Video Reel Player for YouTube Shorts */}
            <div className="w-full max-w-[240px] aspect-[9/16] max-h-[380px] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black relative flex items-center justify-center">
              <iframe
                src={currentReel.videoEmbedUrl}
                title={currentReel.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            {/* Video Source & Official Attribution */}
            <div className="w-full max-w-[260px] flex items-center justify-between mt-2 px-1 text-[11px] text-white/80">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold truncate max-w-[190px]">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                {currentReel.source}
              </span>
              <a 
                href={currentReel.videoUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-white underline text-[10px] shrink-0"
              >
                <span>Full Reel</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            {/* Key Action Protocol Highlight Box */}
            <div className="w-full max-w-[280px] mt-1.5 bg-black/55 backdrop-blur-md border border-white/15 rounded-xl p-2 text-left">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Life-Saving Protocol
                </span>
                <span className="text-[10px] text-white/60">Reel {currentReelIndex + 1}/{REELS_DATA.length}</span>
              </div>
              <p className="text-[11px] font-semibold text-white truncate">
                {currentReel.steps[0].headline}: <span className="font-normal text-white/90">{currentReel.steps[0].instruction}</span>
              </p>
            </div>
          </div>
        ) : (
          /* Action Plan Step-by-Step Card Mode */
          <div className="w-full max-w-xs bg-black/70 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl space-y-3 max-h-[92%] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-primary" />
                Essential Action Protocol
              </span>
              <Badge variant="outline" className="text-[10px] text-primary border-primary/40 bg-primary/10">
                {currentReel.disaster}
              </Badge>
            </div>

            <div className="space-y-2">
              {currentReel.steps.map((st, idx) => (
                <div
                  key={st.stepNumber}
                  onClick={() => {
                    setActiveStepIndex(idx);
                    playTone(400 + idx * 60, "sine", 0.15);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    activeStepIndex === idx 
                      ? "bg-primary/25 border-primary text-white shadow-md" 
                      : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-primary/40 flex items-center justify-center text-[10px] font-bold">
                        {st.stepNumber}
                      </span>
                      {st.headline}
                    </span>
                    {activeStepIndex === idx && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                  </div>
                  <p className="text-[11px] text-white/80 mt-1 leading-snug">
                    {st.instruction}
                  </p>
                </div>
              ))}
            </div>

            <Button
              size="sm"
              onClick={() => setIsDetailsOpen(true)}
              className="w-full text-xs font-bold bg-white text-black hover:bg-white/90"
            >
              View Full Do's and Don'ts Checklist
            </Button>
          </div>
        )}
      </div>

      {/* Right Social Action Rail */}
      <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-3">
        {/* Like Button */}
        <button
          onClick={handleToggleLike}
          className="group flex flex-col items-center transition-transform active:scale-75"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
            isLiked 
              ? "bg-red-600/80 border-red-500 shadow-lg shadow-red-500/40 text-white" 
              : "bg-black/40 border-white/25 text-white hover:bg-black/60"
          }`}>
            <Heart className={`w-4 h-4 ${isLiked ? "fill-white text-white" : ""}`} />
          </div>
          <span className="text-[10px] font-bold mt-0.5 text-white/90 drop-shadow">
            {currentLikes >= 1000 ? `${(currentLikes / 1000).toFixed(1)}k` : currentLikes}
          </span>
        </button>

        {/* Comment Button */}
        <button
          onClick={() => setIsCommentsOpen(true)}
          className="group flex flex-col items-center transition-transform active:scale-75"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/25 text-white hover:bg-black/60">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold mt-0.5 text-white/90 drop-shadow">
            {currentComments.length}
          </span>
        </button>

        {/* Bookmark Button */}
        <button
          onClick={handleToggleBookmark}
          className="group flex flex-col items-center transition-transform active:scale-75"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
            isBookmarked 
              ? "bg-amber-500/80 border-amber-400 text-white shadow-lg shadow-amber-500/40" 
              : "bg-black/40 border-white/25 text-white hover:bg-black/60"
          }`}>
            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-white text-white" : ""}`} />
          </div>
          <span className="text-[10px] font-bold mt-0.5 text-white/90 drop-shadow">Save</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShareReel}
          className="group flex flex-col items-center transition-transform active:scale-75"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/25 text-white hover:bg-black/60">
            <Share2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold mt-0.5 text-white/90 drop-shadow">Share</span>
        </button>

        {/* Emergency Dial Shortcut */}
        <a
          href="tel:112"
          className="group flex flex-col items-center transition-transform active:scale-75"
          title="Dial Emergency 112"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-destructive/90 backdrop-blur-md border border-destructive-foreground/30 text-white hover:bg-destructive shadow-lg shadow-destructive/40">
            <Phone className="w-4 h-4 animate-pulse" />
          </div>
          <span className="text-[10px] font-bold mt-0.5 text-white/90 drop-shadow">112</span>
        </a>
      </div>

      {/* Up / Down Navigation Buttons */}
      <div className="absolute left-3 bottom-24 z-30 flex flex-col gap-1.5">
        <Button
          size="icon"
          variant="ghost"
          onClick={handlePrevReel}
          disabled={currentReelIndex === 0}
          className="w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/70 border border-white/20 disabled:opacity-30"
          title="Previous Reel"
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleNextReel}
          className="w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/70 border border-white/20"
          title="Next Reel"
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Bottom Video Details / Step Navigation */}
      <div className="relative z-20 px-4 pb-3 pt-2 bg-gradient-to-t from-black via-black/85 to-transparent">
        <div className="mr-14 bg-black/65 backdrop-blur-md border border-white/15 p-2.5 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-extrabold text-white tracking-tight truncate max-w-[200px]">
              {currentReel.title}
            </h3>
            {onNavigate && (
              <button
                onClick={() => onNavigate("learning")}
                className="text-[10px] text-primary-foreground/90 font-semibold hover:underline flex items-center gap-0.5"
              >
                <span>Modules</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
          <p className="text-xs text-white/80 line-clamp-2">
            {currentReel.subtitle}
          </p>

          <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-white/10 text-[10px]">
            <button
              onClick={() => setIsDetailsOpen(true)}
              className="text-amber-300 font-bold hover:underline flex items-center gap-1"
            >
              <Info className="w-3 h-3" />
              <span>Do's & Don'ts Checklist</span>
            </button>
            <span className="text-white/40">•</span>
            <span className="text-white/60 truncate">Helpline: {currentReel.emergencyContact}</span>
          </div>
        </div>
      </div>

      {/* Community Comments Dialog */}
      <Dialog open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
        <DialogContent className="max-w-sm max-h-[85vh] flex flex-col p-4 bg-card text-card-foreground">
          <DialogHeader className="pb-2 border-b">
            <DialogTitle className="text-base flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              Preparedness Discussion ({currentComments.length})
            </DialogTitle>
            <DialogDescription className="text-xs">
              Community tips & survival lessons for {currentReel.title}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1 max-h-[280px]">
            {currentComments.map((comment) => (
              <div key={comment.id} className="bg-muted p-2 rounded-lg text-xs space-y-0.5">
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span>{comment.author}</span>
                  <span className="text-[10px] text-muted-foreground font-normal">{comment.timeAgo}</span>
                </div>
                <p className="text-muted-foreground leading-normal">{comment.text}</p>
              </div>
            ))}
          </div>

          <DialogFooter className="pt-2 border-t flex flex-row gap-2">
            <Input
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              placeholder="Share a safety tip or question..."
              className="text-xs flex-1"
            />
            <Button size="sm" onClick={handleAddComment} className="px-3 shrink-0">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Do's and Don'ts Information Dialog (Zero Quizzes!) */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-sm p-4 bg-card text-card-foreground max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-2 border-b">
            <DialogTitle className="text-base flex items-center gap-2">
              <span className="text-xl">{currentReel.emoji}</span>
              {currentReel.disaster} Safety Protocols
            </DialogTitle>
            <DialogDescription className="text-xs">
              Official guidelines verified by {currentReel.source}
            </DialogDescription>
          </DialogHeader>

          <div className="py-2.5 space-y-3">
            {/* Critical DOs */}
            <div>
              <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1 mb-1.5 uppercase tracking-wide">
                <CheckCircle2 className="w-3.5 h-3.5" />
                What You Must Do:
              </h4>
              <ul className="space-y-1.5 text-xs">
                {currentReel.dos.map((d, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-muted-foreground">
                    <span className="text-green-500 font-bold shrink-0">✓</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Critical DONTs */}
            <div className="pt-2 border-t border-border">
              <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1 mb-1.5 uppercase tracking-wide">
                <AlertTriangle className="w-3.5 h-3.5" />
                What You Must Never Do:
              </h4>
              <ul className="space-y-1.5 text-xs">
                {currentReel.donts.map((d, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-muted-foreground">
                    <span className="text-red-500 font-bold shrink-0">✗</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Emergency Contacts */}
            <div className="p-2.5 rounded-lg bg-muted text-xs flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">Emergency Help:</p>
                <p className="text-muted-foreground">{currentReel.emergencyContact}</p>
              </div>
              <a
                href="tel:112"
                className="px-3 py-1.5 bg-destructive text-destructive-foreground rounded-md text-xs font-bold flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                Dial 112
              </a>
            </div>
          </div>

          <DialogFooter>
            <Button size="sm" onClick={() => setIsDetailsOpen(false)} className="w-full">
              Back to Reel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reels;
