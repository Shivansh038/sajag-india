import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, Pause, Volume2, VolumeX, Heart, Share2, 
  MessageCircle, Bookmark, ChevronUp, ChevronDown,
  RotateCcw, HelpCircle, BookOpen, Send, CheckCircle2, 
  XCircle, Award, Sparkles, ShieldCheck, Flame, 
  Activity, ArrowRight, Check, Droplets, Thermometer, Wind, Waves
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
  startTime: number;
  endTime: number;
  stepNumber: number;
  headline: string;
  instruction: string;
  tipType?: "action" | "warning" | "protip";
}

interface ReelQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
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
  disaster: "Earthquake" | "Flood" | "Cyclone" | "Fire" | "Heat Wave" | "Tsunami";
  durationSeconds: number;
  themeGradient: string;
  accentColor: string;
  emoji: string;
  steps: ReelStep[];
  quiz: ReelQuiz;
  defaultComments: Comment[];
  initialLikes: number;
  initialShares: number;
}

const REELS_DATA: Reel[] = [
  {
    id: 1,
    title: "Drop, Cover & Hold On",
    subtitle: "Interactive Earthquake Survival Drill",
    disaster: "Earthquake",
    durationSeconds: 28,
    themeGradient: "from-amber-950 via-stone-900 to-black",
    accentColor: "#f59e0b",
    emoji: "🫨",
    steps: [
      {
        startTime: 0,
        endTime: 7,
        stepNumber: 1,
        headline: "DROP Immediately",
        instruction: "Drop onto your hands and knees before violent shaking throws you down.",
        tipType: "action"
      },
      {
        startTime: 7,
        endTime: 14,
        stepNumber: 2,
        headline: "COVER Head & Neck",
        instruction: "Crawl under a sturdy desk or table to shield yourself from falling lights and ceiling debris.",
        tipType: "action"
      },
      {
        startTime: 14,
        endTime: 21,
        stepNumber: 3,
        headline: "HOLD ON Firmly",
        instruction: "Hold onto your shelter with one hand and stay ready to move with it until the shaking stops.",
        tipType: "action"
      },
      {
        startTime: 21,
        endTime: 28,
        stepNumber: 4,
        headline: "DO NOT Run Outside",
        instruction: "Exterior walls, glass windows, and facade bricks cause 80% of earthquake injuries. Stay indoors!",
        tipType: "warning"
      }
    ],
    quiz: {
      question: "What is the very first action you must take when ground shaking starts?",
      options: [
        "Run for the building exit immediately",
        "Drop to your hands and knees and take cover",
        "Stand under an open doorway",
        "Take the elevator downstairs"
      ],
      correctIndex: 1,
      explanation: "Running during violent shaking leads to falls and injuries. Dropping to hands and knees prevents falling and allows you to crawl to shelter."
    },
    defaultComments: [
      { id: "c1", author: "Aarav Sharma", text: "We practiced this during our school drill last month. It works!", timeAgo: "2 hours ago" },
      { id: "c2", author: "Dr. Meera Iyer", text: "Remember: Keep sturdy shoes beside your bed in case shaking happens at night.", timeAgo: "1 day ago" }
    ],
    initialLikes: 1420,
    initialShares: 284
  },
  {
    id: 2,
    title: "Turn Around, Don't Drown!",
    subtitle: "Interactive Flash Flood Depth Simulator",
    disaster: "Flood",
    durationSeconds: 26,
    themeGradient: "from-blue-950 via-cyan-950 to-black",
    accentColor: "#06b6d4",
    emoji: "🌊",
    steps: [
      {
        startTime: 0,
        endTime: 6,
        stepNumber: 1,
        headline: "Never Walk in Floodwaters",
        instruction: "Just 6 inches of moving water can knock an adult off their feet. Rushing water hides deep holes.",
        tipType: "warning"
      },
      {
        startTime: 6,
        endTime: 13,
        stepNumber: 2,
        headline: "Vehicles Float in 12 Inches",
        instruction: "Never drive through flooded underpasses or roads. 12 inches of water will float and sweep away most cars.",
        tipType: "warning"
      },
      {
        startTime: 13,
        endTime: 20,
        stepNumber: 3,
        headline: "Climb to Higher Ground",
        instruction: "If water rises around your car or home, abandon the vehicle immediately and move uphill on foot.",
        tipType: "action"
      },
      {
        startTime: 20,
        endTime: 26,
        stepNumber: 4,
        headline: "Beware of Electrocution",
        instruction: "Submerged transformers and fallen lines electrify water. Never step in standing water near poles.",
        tipType: "protip"
      }
    ],
    quiz: {
      question: "How deep does rushing flood water need to be to knock an adult down?",
      options: [
        "Just 6 inches",
        "At least 2 feet",
        "Waist-deep water (3 feet)",
        "Over 4 feet"
      ],
      correctIndex: 0,
      explanation: "Just 6 inches of rapidly moving floodwater can easily knock an adult off their feet and sweep them away."
    },
    defaultComments: [
      { id: "c3", author: "Rohan Verma", text: "People always underestimate flooded underpasses during monsoon. Great reel!", timeAgo: "5 hours ago" },
      { id: "c4", author: "Pooja Gupta", text: "Turn Around, Don't Drown needs to be taught in every school.", timeAgo: "2 days ago" }
    ],
    initialLikes: 2185,
    initialShares: 432
  },
  {
    id: 3,
    title: "Cyclone Eye & Wind Tactics",
    subtitle: "Interactive Gale Storm Defense",
    disaster: "Cyclone",
    durationSeconds: 28,
    themeGradient: "from-purple-950 via-indigo-950 to-black",
    accentColor: "#a855f7",
    emoji: "🌀",
    steps: [
      {
        startTime: 0,
        endTime: 7,
        stepNumber: 1,
        headline: "Secure Indoors Early",
        instruction: "Shutter windows, anchor outdoor loose objects, and switch off gas and electricity before winds intensify.",
        tipType: "action"
      },
      {
        startTime: 7,
        endTime: 14,
        stepNumber: 2,
        headline: "Interior Windowless Safe Room",
        instruction: "Shelter in an interior room, hallway, or under the staircase on the lowest level away from glass.",
        tipType: "action"
      },
      {
        startTime: 14,
        endTime: 21,
        stepNumber: 3,
        headline: "Beware of The 'Eye'",
        instruction: "The calm center is deceptive! As the eye passes, violent hurricane winds will abruptly reverse direction.",
        tipType: "warning"
      },
      {
        startTime: 21,
        endTime: 28,
        stepNumber: 4,
        headline: "Listen to Official Radio",
        instruction: "Cell networks often collapse. Keep battery radios tuned to All India Radio or NDMA bulletins.",
        tipType: "protip"
      }
    ],
    quiz: {
      question: "During a cyclone, what should you do when the wind suddenly stops and the sky clears?",
      options: [
        "Go outside to examine fallen trees and inspect property",
        "Remain inside shelter — this is the storm's eye and reverse winds will follow",
        "Open all doors and windows to air out the room",
        "Drive to the nearest beach to check ocean water"
      ],
      correctIndex: 1,
      explanation: "The eye of the cyclone is a calm pocket in the center. The second half of the cyclone strikes rapidly with equal or greater intensity from the opposite direction."
    },
    defaultComments: [
      { id: "c5", author: "Kavita Nair", text: "Lived through Cyclone Fani in Odisha. The eye trick is so real!", timeAgo: "3 hours ago" }
    ],
    initialLikes: 1890,
    initialShares: 310
  },
  {
    id: 4,
    title: "Stop, Drop & Low Crawl",
    subtitle: "Interactive Fire & Smoke Escape",
    disaster: "Fire",
    durationSeconds: 26,
    themeGradient: "from-red-950 via-orange-950 to-black",
    accentColor: "#ef4444",
    emoji: "🔥",
    steps: [
      {
        startTime: 0,
        endTime: 6,
        stepNumber: 1,
        headline: "If Clothes Catch Fire",
        instruction: "STOP moving, DROP flat to the ground, and ROLL back and forth to smother the flames.",
        tipType: "action"
      },
      {
        startTime: 6,
        endTime: 13,
        stepNumber: 2,
        headline: "CRAWL Low Under Smoke",
        instruction: "Toxic smoke and superheated air rise to the ceiling. Crawl on hands and knees where oxygen remains cleaner.",
        tipType: "action"
      },
      {
        startTime: 13,
        endTime: 20,
        stepNumber: 3,
        headline: "Check Doors with Back of Hand",
        instruction: "Feel the door handle and door with the BACK of your hand. If hot, fire is outside — use another escape path.",
        tipType: "warning"
      },
      {
        startTime: 20,
        endTime: 26,
        stepNumber: 4,
        headline: "Never Use Elevators",
        instruction: "Power failure can trap you in the shaft, which acts as a smoke chimney. Always use marked fire stairs.",
        tipType: "protip"
      }
    ],
    quiz: {
      question: "Why should you use the back of your hand to feel closed doors during a fire?",
      options: [
        "It provides better grip on the handle",
        "The back of your hand is more sensitive to heat and prevents your palm from blistering into a grip reflex",
        "It protects your watch and jewelry",
        "Firefighters recommend it for speed"
      ],
      correctIndex: 1,
      explanation: "If you touch a hot handle with your palm, the heat can cause an involuntary muscle spasm that grips the searing metal and burns your hand."
    },
    defaultComments: [
      { id: "c6", author: "Capt. Rajesh", text: "As a firefighter, please remember: Never go back inside for personal belongings!", timeAgo: "1 day ago" }
    ],
    initialLikes: 2540,
    initialShares: 512
  },
  {
    id: 5,
    title: "Beating Extreme Heatwaves",
    subtitle: "Interactive Hydration & Temp Simulator",
    disaster: "Heat Wave",
    durationSeconds: 26,
    themeGradient: "from-orange-950 via-amber-950 to-black",
    accentColor: "#f97316",
    emoji: "🥵",
    steps: [
      {
        startTime: 0,
        endTime: 6,
        stepNumber: 1,
        headline: "Drink Electrolytes Regularly",
        instruction: "Drink water, ORS, lemon water, and buttermilk every 20-30 minutes, even if you do not feel thirsty.",
        tipType: "action"
      },
      {
        startTime: 6,
        endTime: 13,
        stepNumber: 2,
        headline: "Avoid Peak Sun Hours",
        instruction: "Stay indoors between 12:00 PM and 3:30 PM. Use light-colored, loose cotton clothing and wide-brim hats.",
        tipType: "warning"
      },
      {
        startTime: 13,
        endTime: 20,
        stepNumber: 3,
        headline: "Recognize Heatstroke",
        instruction: "High body temperature (>103°F), confusion, hot dry red skin, and dizziness are medical emergencies.",
        tipType: "warning"
      },
      {
        startTime: 20,
        endTime: 26,
        stepNumber: 4,
        headline: "First Aid for Heat Collapse",
        instruction: "Move victim to shaded breeze, apply wet cold towels to neck and armpits, and call 108 ambulance immediately.",
        tipType: "protip"
      }
    ],
    quiz: {
      question: "Which of the following is an effective drink to prevent heat exhaustion during a severe heatwave?",
      options: [
        "Chilled sugary soda",
        "ORS solution, buttermilk, or lemon water",
        "Caffeinated energy drinks",
        "Hot tea"
      ],
      correctIndex: 1,
      explanation: "ORS, buttermilk, and lemon water replenish vital salts, sodium, and potassium lost through heavy sweating, whereas caffeine and sugary sodas accelerate dehydration."
    },
    defaultComments: [
      { id: "c7", author: "Dr. Ananya Sen", text: "Crucial for North Indian summers where temperatures cross 45°C. Stay hydrated!", timeAgo: "4 hours ago" }
    ],
    initialLikes: 1670,
    initialShares: 295
  },
  {
    id: 6,
    title: "Tsunami Nature Warning Signs",
    subtitle: "Interactive Uphill Evacuation Run",
    disaster: "Tsunami",
    durationSeconds: 28,
    themeGradient: "from-teal-950 via-blue-950 to-black",
    accentColor: "#14b8a6",
    emoji: "🌊",
    steps: [
      {
        startTime: 0,
        endTime: 7,
        stepNumber: 1,
        headline: "Sudden Ocean Drawdown",
        instruction: "If the sea draws back rapidly, exposing the sea bed and flopping fish, a massive tsunami surge is coming!",
        tipType: "warning"
      },
      {
        startTime: 7,
        endTime: 14,
        stepNumber: 2,
        headline: "Ocean Roar Sound",
        instruction: "Tsunamis sound like a roaring freight train or approaching jet aircraft from several kilometers away.",
        tipType: "warning"
      },
      {
        startTime: 14,
        endTime: 21,
        stepNumber: 3,
        headline: "Run Inland & Uphill",
        instruction: "Do NOT stop to watch or take photos! Run immediately at least 1-2 km inland or 100+ feet uphill.",
        tipType: "action"
      },
      {
        startTime: 21,
        endTime: 28,
        stepNumber: 4,
        headline: "Multiple Waves Follow",
        instruction: "The first wave is rarely the largest. Waves continue arriving for hours. Wait for official all-clear.",
        tipType: "protip"
      }
    ],
    quiz: {
      question: "If you notice the ocean shoreline pulling back rapidly into the horizon, what should you do?",
      options: [
        "Walk into the newly exposed sand to collect seashells and fish",
        "Take videos and wait for local sirens to sound",
        "Run inland and uphill to high elevation immediately",
        "Board a coastal boat to ride it out"
      ],
      correctIndex: 2,
      explanation: "Sudden seawater withdrawal is nature's clearest tsunami warning. A towering wave surge will strike the shore within minutes."
    },
    defaultComments: [
      { id: "c8", author: "Suresh Pillai", text: "The 2004 Indian Ocean tsunami taught us this life-saving lesson.", timeAgo: "6 hours ago" }
    ],
    initialLikes: 2310,
    initialShares: 480
  }
];

interface ReelsProps {
  onNavigate?: (screen: string) => void;
}

const Reels = ({ onNavigate }: ReelsProps) => {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVoiceNarratorEnabled, setIsVoiceNarratorEnabled] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeMode, setActiveMode] = useState<"watch" | "drill">("drill"); // Default to interactive drill!

  // --- Interactive Drill States ---
  // Earthquake drill
  const [eqStage, setEqStage] = useState<"idle" | "dropped" | "covered" | "held" | "completed">("idle");
  const [eqHoldTimer, setEqHoldTimer] = useState(3);

  // Flood simulator
  const [floodDepth, setFloodDepth] = useState<number>(14); // inches
  const [floodDecision, setFloodDecision] = useState<"none" | "turn" | "drive">("none");

  // Cyclone defense
  const [cycloneChecklist, setCycloneChecklist] = useState({ windows: false, power: false, safeRoom: false });
  const [cycloneEyeDecision, setCycloneEyeDecision] = useState<"none" | "stay" | "outside">("none");

  // Fire reaction
  const [fireSteps, setFireSteps] = useState({ stop: false, drop: false, roll: false });
  const [doorChecked, setDoorChecked] = useState<"none" | "checked_hot" | "checked_cool">("none");

  // Heatwave recovery
  const [bodyTemp, setBodyTemp] = useState<number>(39.8); // Celsius
  const [hydrationLevel, setHydrationLevel] = useState<number>(35); // Percent

  // Tsunami elevation run
  const [elevationMeters, setElevationMeters] = useState<number>(10);
  const [tsunamiEscaped, setTsunamiEscaped] = useState<boolean>(false);

  // Interaction states stored per reel
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});
  const [likesCountMap, setLikesCountMap] = useState<Record<number, number>>({});
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<number, boolean>>({});
  const [commentsMap, setCommentsMap] = useState<Record<number, Comment[]>>({});
  const [drillCompletedMap, setDrillCompletedMap] = useState<Record<number, boolean>>({});

  // Modals
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [hasAnsweredQuiz, setHasAnsweredQuiz] = useState(false);

  const { toast } = useToast();
  const currentReel = REELS_DATA[currentReelIndex];
  const lastSpokenStepRef = useRef<number>(-1);

  // Load saved state
  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem("sajag_reel_likes");
      if (savedLikes) setLikedMap(JSON.parse(savedLikes));

      const savedBookmarks = localStorage.getItem("sajag_reel_bookmarks");
      if (savedBookmarks) setBookmarkedMap(JSON.parse(savedBookmarks));

      const savedComments = localStorage.getItem("sajag_reel_comments");
      if (savedComments) setCommentsMap(JSON.parse(savedComments));

      const savedDrills = localStorage.getItem("sajag_reel_drills");
      if (savedDrills) setDrillCompletedMap(JSON.parse(savedDrills));
    } catch (e) {
      console.warn("Could not load interactions", e);
    }

    const counts: Record<number, number> = {};
    REELS_DATA.forEach(r => { counts[r.id] = r.initialLikes; });
    setLikesCountMap(counts);
  }, []);

  // Timer loop for video simulation & progress bar
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedTime((prev) => {
          if (prev >= currentReel.durationSeconds) return 0;
          return Math.min(currentReel.durationSeconds, +(prev + 0.25).toFixed(2));
        });
      }, 250);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isPlaying, currentReel.durationSeconds]);

  // Active step in timeline
  const activeStep = useMemo(() => {
    const step = currentReel.steps.find(
      (s) => elapsedTime >= s.startTime && elapsedTime < s.endTime
    );
    return step || currentReel.steps[0];
  }, [currentReel, elapsedTime]);

  // Voice Narration using Web Speech API
  useEffect(() => {
    if (!isVoiceNarratorEnabled || !isPlaying) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      return;
    }

    if (activeStep && activeStep.stepNumber !== lastSpokenStepRef.current) {
      lastSpokenStepRef.current = activeStep.stepNumber;
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`${activeStep.headline}. ${activeStep.instruction}`);
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [activeStep, isVoiceNarratorEnabled, isPlaying]);

  // Reset drill state when changing reels
  const resetDrillState = useCallback((disaster: Reel["disaster"]) => {
    setEqStage("idle");
    setEqHoldTimer(3);
    setFloodDepth(14);
    setFloodDecision("none");
    setCycloneChecklist({ windows: false, power: false, safeRoom: false });
    setCycloneEyeDecision("none");
    setFireSteps({ stop: false, drop: false, roll: false });
    setDoorChecked("none");
    setBodyTemp(39.8);
    setHydrationLevel(35);
    setElevationMeters(10);
    setTsunamiEscaped(false);
  }, []);

  // Change Reel handler
  const handleSelectReel = useCallback((index: number) => {
    if (index >= 0 && index < REELS_DATA.length) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      lastSpokenStepRef.current = -1;
      setCurrentReelIndex(index);
      setElapsedTime(0);
      setIsPlaying(true);
      setSelectedQuizAnswer(null);
      setHasAnsweredQuiz(false);
      resetDrillState(REELS_DATA[index].disaster);
    }
  }, [resetDrillState]);

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

  // Mark drill completed and award safety points
  const awardDrillPoints = useCallback((drillName: string) => {
    playTone(587.33, "triangle", 0.3); // High D chime
    setTimeout(() => playTone(880, "sine", 0.4), 150); // A5 celebration

    const updated = { ...drillCompletedMap, [currentReel.id]: true };
    setDrillCompletedMap(updated);

    try {
      localStorage.setItem("sajag_reel_drills", JSON.stringify(updated));
      const prevProgressStr = localStorage.getItem("sajag_progress");
      const prev = prevProgressStr ? JSON.parse(prevProgressStr) : { progress: 0 };
      const newProgress = Math.min(100, (prev.progress || 0) + 10);
      localStorage.setItem("sajag_progress", JSON.stringify({ ...prev, progress: newProgress }));
    } catch (e) {
      console.warn(e);
    }

    toast({
      title: "🎉 Drill Mastered!",
      description: `You successfully survived the ${drillName} drill! +10 Preparedness points added to your Home score!`,
    });
  }, [currentReel.id, drillCompletedMap, toast]);

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
        title: "❤️ Reel Liked!",
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
      title: newBookmarked ? "🔖 Saved to Bookmarks" : "Removed from Bookmarks",
      description: newBookmarked ? "Quick access saved to your preparedness library." : undefined,
    });
  };

  // Share reel
  const handleShareReel = async () => {
    playTone(493.88, "sine", 0.2);
    const shareText = `🚨 Sajag Disaster Interactive Reel: "${currentReel.title}"\n${activeStep.headline}: ${activeStep.instruction}\nPractice the interactive survival drill on Sajag!`;
    
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
        title: "📋 Copied to Clipboard!",
        description: "Survival reel guide copied. Share it with classmates or family!",
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
      description: "Your survival tip has been shared with the Sajag community.",
    });
  };

  // Quiz submission
  const handleQuizAnswer = (index: number) => {
    if (hasAnsweredQuiz) return;
    setSelectedQuizAnswer(index);
    setHasAnsweredQuiz(true);

    const isCorrect = index === currentReel.quiz.correctIndex;
    if (isCorrect) {
      playTone(523.25, "sine", 0.2);
      setTimeout(() => playTone(783.99, "sine", 0.3), 100);
      try {
        const prevProgressStr = localStorage.getItem("sajag_progress");
        const prev = prevProgressStr ? JSON.parse(prevProgressStr) : { progress: 0 };
        const newProgress = Math.min(100, (prev.progress || 0) + 5);
        localStorage.setItem("sajag_progress", JSON.stringify({ ...prev, progress: newProgress }));
      } catch (e) {
        console.warn(e);
      }
    } else {
      playTone(220, "sawtooth", 0.3);
    }
  };

  const progressPercentage = Math.min(100, (elapsedTime / currentReel.durationSeconds) * 100);
  const currentComments = commentsMap[currentReel.id] || currentReel.defaultComments;
  const isLiked = !!likedMap[currentReel.id];
  const isBookmarked = !!bookmarkedMap[currentReel.id];
  const currentLikes = likesCountMap[currentReel.id] || currentReel.initialLikes;
  const isCurrentDrillDone = !!drillCompletedMap[currentReel.id];

  // Render Disaster-specific interactive mini-drill inside center stage
  const renderInteractiveDrill = () => {
    switch (currentReel.disaster) {
      // 1. EARTHQUAKE INTERACTIVE DRILL
      case "Earthquake":
        return (
          <div className="w-full max-w-xs bg-black/60 backdrop-blur-md border border-amber-500/30 rounded-2xl p-4 text-center shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                TREMOR SIMULATOR: 6.8 MAGNITUDE
              </span>
              {isCurrentDrillDone && (
                <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/40 text-[10px] py-0">
                  <ShieldCheck className="w-3 h-3 mr-1" /> SURVIVED
                </Badge>
              )}
            </div>

            {/* Visual Action Indicator */}
            <div className="py-2">
              {eqStage === "idle" && (
                <div className="space-y-1 animate-bounce">
                  <p className="text-3xl">🫨</p>
                  <p className="text-sm font-extrabold text-white">GROUND IS SHAKING VIOLENTLY!</p>
                  <p className="text-xs text-amber-200/80">Tap DROP below to get low to the floor!</p>
                </div>
              )}
              {eqStage === "dropped" && (
                <div className="space-y-1">
                  <p className="text-3xl">🧘</p>
                  <p className="text-sm font-bold text-amber-300">You dropped to your knees!</p>
                  <p className="text-xs text-white/80">Now crawl under the desk: Tap COVER!</p>
                </div>
              )}
              {eqStage === "covered" && (
                <div className="space-y-1">
                  <p className="text-3xl">🛡️</p>
                  <p className="text-sm font-bold text-cyan-300">Head and neck shielded under desk!</p>
                  <p className="text-xs text-white/80">Tap HOLD ON firm until shaking ceases!</p>
                </div>
              )}
              {eqStage === "held" && (
                <div className="space-y-1">
                  <p className="text-3xl">✊</p>
                  <p className="text-sm font-bold text-yellow-300">Holding tight to desk legs...</p>
                  <p className="text-xs text-white/90">Tremor subsiding: {eqHoldTimer}s</p>
                </div>
              )}
              {eqStage === "completed" && (
                <div className="space-y-1">
                  <p className="text-3xl">🏆</p>
                  <p className="text-sm font-bold text-green-400">Survival Drill Completed!</p>
                  <p className="text-xs text-green-200">Reflex Score: 100% Protected indoors!</p>
                </div>
              )}
            </div>

            {/* Interactive Step Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <Button
                size="sm"
                variant={eqStage === "idle" ? "default" : "outline"}
                disabled={eqStage !== "idle"}
                onClick={() => {
                  playTone(330, "sine", 0.2);
                  setEqStage("dropped");
                }}
                className={`text-xs font-bold py-1.5 h-auto ${eqStage === "idle" ? "bg-amber-500 hover:bg-amber-600 animate-pulse text-black" : "opacity-60"}`}
              >
                1. DROP
              </Button>
              <Button
                size="sm"
                variant={eqStage === "dropped" ? "default" : "outline"}
                disabled={eqStage !== "dropped"}
                onClick={() => {
                  playTone(440, "sine", 0.2);
                  setEqStage("covered");
                }}
                className={`text-xs font-bold py-1.5 h-auto ${eqStage === "dropped" ? "bg-cyan-500 hover:bg-cyan-600 animate-pulse text-black" : "opacity-60"}`}
              >
                2. COVER
              </Button>
              <Button
                size="sm"
                variant={eqStage === "covered" ? "default" : "outline"}
                disabled={eqStage !== "covered"}
                onClick={() => {
                  playTone(550, "sine", 0.2);
                  setEqStage("held");
                  let remaining = 3;
                  const intv = setInterval(() => {
                    remaining -= 1;
                    setEqHoldTimer(remaining);
                    if (remaining <= 0) {
                      clearInterval(intv);
                      setEqStage("completed");
                      awardDrillPoints("Earthquake Drop-Cover-Hold");
                    }
                  }, 800);
                }}
                className={`text-xs font-bold py-1.5 h-auto ${eqStage === "covered" ? "bg-green-500 hover:bg-green-600 animate-pulse text-black" : "opacity-60"}`}
              >
                3. HOLD ON
              </Button>
            </div>

            {eqStage === "completed" && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  setEqStage("idle");
                  setEqHoldTimer(3);
                }}
                className="text-[11px] text-white/70 hover:text-white py-1 h-auto"
              >
                <RotateCcw className="w-3 h-3 mr-1" /> Replay Tremor Drill
              </Button>
            )}
          </div>
        );

      // 2. FLOOD INTERACTIVE SIMULATOR
      case "Flood":
        return (
          <div className="w-full max-w-xs bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-4 text-center shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                <Waves className="w-3.5 h-3.5 animate-pulse" />
                WATER DEPTH SIMULATOR
              </span>
              <span className="text-xs font-mono font-bold text-white bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
                {floodDepth}" inches
              </span>
            </div>

            {/* Depth Level Interactive Slider & Hazard Meter */}
            <div className="space-y-2 py-1">
              <input
                type="range"
                min="3"
                max="24"
                step="3"
                value={floodDepth}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setFloodDepth(val);
                  setFloodDecision("none");
                  playTone(200 + val * 15, "triangle", 0.15);
                }}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-gray-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-white/60">
                <span>3" Ankle</span>
                <span>6" Knocks Adult</span>
                <span>12" Floats Car</span>
                <span>24" Sweeps SUV</span>
              </div>
            </div>

            {/* Simulated Scenario */}
            <div className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
              floodDecision === "turn" 
                ? "bg-green-950/70 border-green-500 text-green-200"
                : floodDecision === "drive"
                ? "bg-red-950/70 border-red-500 text-red-200"
                : "bg-white/5 border-white/10 text-white"
            }`}>
              {floodDecision === "none" && (
                <p>
                  🚗 You approach a flooded underpass with <strong>{floodDepth} inches</strong> of swift water. What will you do?
                </p>
              )}
              {floodDecision === "turn" && (
                <div className="space-y-1">
                  <p className="font-bold flex items-center gap-1 text-green-400">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    Turned Around to Safety!
                  </p>
                  <p className="text-[11px]">
                    Smart decision! 12+ inches of rushing water floats 95% of cars and sweeps them off roadways into canals.
                  </p>
                </div>
              )}
              {floodDecision === "drive" && (
                <div className="space-y-1">
                  <p className="font-bold flex items-center gap-1 text-red-400">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    CRITICAL DANGER: Vehicle Flooded!
                  </p>
                  <p className="text-[11px]">
                    Engine sucked water and stalled! Vehicle buoyant and drifting towards river embankment! Call 112 immediately!
                  </p>
                </div>
              )}
            </div>

            {/* Action Decision Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setFloodDecision("turn");
                  awardDrillPoints("Flood Turn Around Protocol");
                }}
                className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 h-auto"
              >
                🛑 TURN AROUND
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  playTone(180, "sawtooth", 0.4);
                  setFloodDecision("drive");
                }}
                className="border-red-500/50 hover:bg-red-950/40 text-red-300 text-xs font-bold py-2 h-auto"
              >
                🚗 RISK IT & DRIVE
              </Button>
            </div>
          </div>
        );

      // 3. CYCLONE GALE DEFENSE DRILL
      case "Cyclone":
        const allSecured = cycloneChecklist.windows && cycloneChecklist.power && cycloneChecklist.safeRoom;
        return (
          <div className="w-full max-w-xs bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-2xl p-4 text-center shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 animate-pulse" />
                GALE DEFENSE: 140 KM/H
              </span>
              <Badge variant="outline" className="text-[10px] py-0 border-purple-400/40 text-purple-300">
                {Object.values(cycloneChecklist).filter(Boolean).length}/3 SECURED
              </Badge>
            </div>

            {/* Interactive Checklist Taps */}
            <div className="space-y-1.5 text-left">
              <button
                onClick={() => {
                  playTone(400, "sine", 0.15);
                  setCycloneChecklist(prev => ({ ...prev, windows: !prev.windows }));
                }}
                className={`w-full p-2 rounded-lg text-xs font-medium flex items-center justify-between border transition-all ${
                  cycloneChecklist.windows 
                    ? "bg-purple-950/70 border-purple-500 text-purple-200" 
                    : "bg-white/5 border-white/15 text-white/80 hover:bg-white/10"
                }`}
              >
                <span>🪟 1. Shutter & Tape Windows</span>
                {cycloneChecklist.windows && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
              </button>

              <button
                onClick={() => {
                  playTone(450, "sine", 0.15);
                  setCycloneChecklist(prev => ({ ...prev, power: !prev.power }));
                }}
                className={`w-full p-2 rounded-lg text-xs font-medium flex items-center justify-between border transition-all ${
                  cycloneChecklist.power 
                    ? "bg-purple-950/70 border-purple-500 text-purple-200" 
                    : "bg-white/5 border-white/15 text-white/80 hover:bg-white/10"
                }`}
              >
                <span>⚡ 2. Cut Main Gas & Power Switch</span>
                {cycloneChecklist.power && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
              </button>

              <button
                onClick={() => {
                  playTone(500, "sine", 0.15);
                  setCycloneChecklist(prev => ({ ...prev, safeRoom: !prev.safeRoom }));
                }}
                className={`w-full p-2 rounded-lg text-xs font-medium flex items-center justify-between border transition-all ${
                  cycloneChecklist.safeRoom 
                    ? "bg-purple-950/70 border-purple-500 text-purple-200" 
                    : "bg-white/5 border-white/15 text-white/80 hover:bg-white/10"
                }`}
              >
                <span>🚪 3. Move to Windowless Inner Room</span>
                {cycloneChecklist.safeRoom && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
              </button>
            </div>

            {/* Eye of the storm prompt */}
            {allSecured && (
              <div className="pt-1 space-y-2 animate-in fade-in zoom-in-95">
                <p className="text-[11px] font-bold text-yellow-300">
                  ⚠️ Winds abruptly stopped! Blue sky visible. Do you step outside?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setCycloneEyeDecision("stay");
                      awardDrillPoints("Cyclone Storm Shelter");
                    }}
                    className="bg-green-600 hover:bg-green-700 text-xs font-bold py-1.5 h-auto text-white"
                  >
                    STAY INSIDE (Eye of Storm)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      playTone(180, "sawtooth", 0.3);
                      setCycloneEyeDecision("outside");
                    }}
                    className="border-red-500 text-red-300 text-xs font-bold py-1.5 h-auto hover:bg-red-950/40"
                  >
                    GO OUTSIDE
                  </Button>
                </div>
                {cycloneEyeDecision === "stay" && (
                  <p className="text-[11px] text-green-300 font-medium">
                    ✅ Correct! The second half of the storm strikes in reverse minutes later!
                  </p>
                )}
                {cycloneEyeDecision === "outside" && (
                  <p className="text-[11px] text-red-300 font-medium">
                    ❌ Dangerous! Hurricane-force reverse winds strike without warning!
                  </p>
                )}
              </div>
            )}
          </div>
        );

      // 4. FIRE EMERGENCY RESPONSE DRILL
      case "Fire":
        const fireStepsDone = fireSteps.stop && fireSteps.drop && fireSteps.roll;
        return (
          <div className="w-full max-w-xs bg-black/60 backdrop-blur-md border border-red-500/30 rounded-2xl p-4 text-center shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 animate-pulse" />
                FIRE EVACUATION DRILL
              </span>
              <span className="text-[10px] text-white/70">Reflex Mode</span>
            </div>

            {/* Stop, Drop, Roll buttons */}
            <div className="space-y-1">
              <p className="text-xs text-white/90 font-medium">Clothes caught flame? Tap in order:</p>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <Button
                  size="sm"
                  onClick={() => {
                    playTone(350, "sine", 0.15);
                    setFireSteps(p => ({ ...p, stop: true }));
                  }}
                  className={`text-xs font-bold py-1.5 h-auto ${fireSteps.stop ? "bg-red-600 text-white" : "bg-white/10 text-white"}`}
                >
                  1. STOP
                </Button>
                <Button
                  size="sm"
                  disabled={!fireSteps.stop}
                  onClick={() => {
                    playTone(450, "sine", 0.15);
                    setFireSteps(p => ({ ...p, drop: true }));
                  }}
                  className={`text-xs font-bold py-1.5 h-auto ${fireSteps.drop ? "bg-orange-600 text-white" : "bg-white/10 text-white"}`}
                >
                  2. DROP
                </Button>
                <Button
                  size="sm"
                  disabled={!fireSteps.drop}
                  onClick={() => {
                    playTone(600, "sine", 0.2);
                    setFireSteps(p => ({ ...p, roll: true }));
                  }}
                  className={`text-xs font-bold py-1.5 h-auto ${fireSteps.roll ? "bg-green-600 text-white" : "bg-white/10 text-white"}`}
                >
                  3. ROLL
                </Button>
              </div>
            </div>

            {/* Closed Door Temperature Check Interactive */}
            {fireStepsDone && (
              <div className="pt-2 border-t border-white/10 space-y-2 animate-in fade-in">
                <p className="text-xs text-amber-200">
                  🚪 Approaching closed exit door: Check handle heat with <strong>BACK of hand</strong>:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      playTone(200, "sawtooth", 0.3);
                      setDoorChecked("checked_hot");
                    }}
                    className="border-red-500 text-red-300 text-xs font-bold py-1.5 h-auto hover:bg-red-950/40"
                  >
                    Handle is HOT
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setDoorChecked("checked_cool");
                      awardDrillPoints("Fire Escape Low-Crawl");
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1.5 h-auto"
                  >
                    Handle is COOL
                  </Button>
                </div>

                {doorChecked === "checked_hot" && (
                  <p className="text-[11px] text-red-300 font-medium">
                    ⚠️ Fire is right on other side! Do not open — find secondary window or staircase exit!
                  </p>
                )}
                {doorChecked === "checked_cool" && (
                  <p className="text-[11px] text-green-300 font-medium">
                    ✅ Safe to open slowly. Stay low on floor to avoid rising toxic smoke layer!
                  </p>
                )}
              </div>
            )}
          </div>
        );

      // 5. HEATWAVE HYDRATION COMBAT
      case "Heat Wave":
        const isRecovered = bodyTemp <= 37.5 && hydrationLevel >= 80;
        return (
          <div className="w-full max-w-xs bg-black/60 backdrop-blur-md border border-orange-500/30 rounded-2xl p-4 text-center shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-orange-400 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 animate-pulse" />
                HEATSTROKE COMBAT: 46°C OUTDOORS
              </span>
              {isRecovered && (
                <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/40 text-[10px] py-0">
                  STABILIZED
                </Badge>
              )}
            </div>

            {/* Live Metrics Gauges */}
            <div className="grid grid-cols-2 gap-2 py-1">
              <div className="bg-white/5 border border-white/10 p-2 rounded-xl text-left">
                <span className="text-[10px] text-white/60">Core Body Temp</span>
                <p className={`text-base font-extrabold ${bodyTemp > 38.5 ? "text-red-400 animate-pulse" : "text-green-400"}`}>
                  {bodyTemp.toFixed(1)}°C ({((bodyTemp * 9/5) + 32).toFixed(1)}°F)
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 p-2 rounded-xl text-left">
                <span className="text-[10px] text-white/60">Hydration Level</span>
                <p className={`text-base font-extrabold ${hydrationLevel < 60 ? "text-orange-400" : "text-cyan-400"}`}>
                  {hydrationLevel}%
                </p>
              </div>
            </div>

            {/* Interactive Drink / Cool Taps */}
            <p className="text-xs text-white/80">Tap remedies to lower body temperature:</p>
            <div className="grid grid-cols-3 gap-1.5">
              <Button
                size="sm"
                onClick={() => {
                  playTone(520, "sine", 0.15);
                  setBodyTemp(t => Math.max(37.0, +(t - 0.7).toFixed(1)));
                  setHydrationLevel(h => Math.min(100, h + 25));
                  if (bodyTemp - 0.7 <= 37.5 && hydrationLevel + 25 >= 80) {
                    awardDrillPoints("Heatwave ORS Hydration");
                  }
                }}
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-[11px] font-bold py-1.5 h-auto flex flex-col items-center"
              >
                <span>💧</span>
                <span>ORS Salts</span>
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  playTone(560, "sine", 0.15);
                  setBodyTemp(t => Math.max(37.0, +(t - 0.5).toFixed(1)));
                  setHydrationLevel(h => Math.min(100, h + 20));
                  if (bodyTemp - 0.5 <= 37.5 && hydrationLevel + 20 >= 80) {
                    awardDrillPoints("Heatwave Coconut Water");
                  }
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold py-1.5 h-auto flex flex-col items-center"
              >
                <span>🥥</span>
                <span>Coconut</span>
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  playTone(600, "sine", 0.15);
                  setBodyTemp(t => Math.max(37.0, +(t - 0.9).toFixed(1)));
                  if (bodyTemp - 0.9 <= 37.5 && hydrationLevel >= 80) {
                    awardDrillPoints("Heatwave Cold Towel Cooling");
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1.5 h-auto flex flex-col items-center"
              >
                <span>🧊</span>
                <span>Ice Towel</span>
              </Button>
            </div>

            {isRecovered && (
              <p className="text-xs text-green-300 font-bold animate-in fade-in">
                🎉 Core temperature stabilized at safe 37.0°C! Heat exhaustion averted.
              </p>
            )}
          </div>
        );

      // 6. TSUNAMI UPHILL EVACUATION RUN
      case "Tsunami":
        return (
          <div className="w-full max-w-xs bg-black/60 backdrop-blur-md border border-teal-500/30 rounded-2xl p-4 text-center shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-teal-400 flex items-center gap-1">
                <Waves className="w-3.5 h-3.5 animate-pulse" />
                TSUNAMI EVACUATION CLIMB
              </span>
              <span className="text-xs font-mono font-bold text-white bg-teal-950 px-2 py-0.5 rounded border border-teal-500/40">
                {elevationMeters}m Uphill
              </span>
            </div>

            {/* Elevation Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-white/20">
                <div 
                  className={`h-full transition-all duration-300 ${elevationMeters >= 100 ? "bg-green-500" : "bg-teal-500"}`}
                  style={{ width: `${Math.min(100, (elevationMeters / 100) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-white/60">
                <span>0m Shore (Lethal)</span>
                <span>50m Moderate</span>
                <span className="font-bold text-green-300">100m+ Safe Ridge</span>
              </div>
            </div>

            {/* Run Button */}
            <div className="py-2">
              {!tsunamiEscaped ? (
                <Button
                  size="lg"
                  onClick={() => {
                    playTone(250 + elevationMeters * 5, "sine", 0.15);
                    const nextM = elevationMeters + 15;
                    setElevationMeters(nextM);
                    if (nextM >= 100) {
                      setTsunamiEscaped(true);
                      awardDrillPoints("Tsunami High-Ground Evacuation");
                    }
                  }}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-black font-extrabold text-sm py-3 h-auto animate-pulse shadow-lg shadow-teal-500/30"
                >
                  🏃 RUN UPHILL! (+15m per tap)
                </Button>
              ) : (
                <div className="space-y-1 bg-green-950/70 border border-green-500 p-2.5 rounded-xl text-green-200">
                  <p className="font-bold flex items-center justify-center gap-1 text-green-400">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    Reached High Elevation (100m+)
                  </p>
                  <p className="text-[11px]">
                    Safe from the 25-meter incoming tidal surge! Stay at safe ridge until official all-clear.
                  </p>
                </div>
              )}
            </div>

            {tsunamiEscaped && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setElevationMeters(10);
                  setTsunamiEscaped(false);
                }}
                className="text-[11px] text-white/70 hover:text-white py-1 h-auto"
              >
                <RotateCcw className="w-3 h-3 mr-1" /> Retry Elevation Dash
              </Button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-130px)] max-h-[750px] bg-black text-white select-none overflow-hidden rounded-xl shadow-2xl flex flex-col justify-between">
      
      {/* Dynamic Animated Disaster Canvas Background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${currentReel.themeGradient} transition-colors duration-700`}>
        {/* Hazard Particles Simulation */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          {currentReel.disaster === "Earthquake" && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-96 h-96 rounded-full border-4 border-amber-500/40 animate-ping" />
              <div className="w-64 h-64 rounded-full border-2 border-amber-400/30 animate-pulse absolute" />
            </div>
          )}
          {currentReel.disaster === "Flood" && (
            <div className="w-full h-full flex flex-col justify-end">
              <div className="h-44 bg-cyan-600/30 blur-xl animate-pulse" />
              <div className="h-28 bg-blue-600/40 blur-2xl" />
            </div>
          )}
          {currentReel.disaster === "Cyclone" && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-80 h-80 rounded-full border-8 border-dashed border-purple-400/40 animate-spin [animation-duration:8s]" />
            </div>
          )}
          {currentReel.disaster === "Fire" && (
            <div className="w-full h-full flex flex-col justify-end">
              <div className="h-48 bg-gradient-to-t from-red-600/50 via-orange-500/30 to-transparent blur-xl animate-pulse" />
            </div>
          )}
          {currentReel.disaster === "Heat Wave" && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-amber-500/40 to-orange-500/30 blur-2xl animate-pulse" />
            </div>
          )}
          {currentReel.disaster === "Tsunami" && (
            <div className="w-full h-full flex flex-col justify-end">
              <div className="h-48 bg-teal-600/30 blur-xl animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* Top Header Bar: Stories Scrubber & Mode Toggles */}
      <div className="relative z-20 px-4 pt-3 pb-2 bg-gradient-to-b from-black/80 to-transparent">
        {/* Story Scrubber Segments */}
        <div className="flex gap-1.5 mb-2.5">
          {REELS_DATA.map((r, idx) => (
            <div 
              key={r.id} 
              onClick={() => handleSelectReel(idx)}
              className="flex-1 h-1.5 bg-white/25 rounded-full overflow-hidden cursor-pointer hover:bg-white/40"
              title={r.title}
            >
              <div 
                className="h-full bg-white transition-all duration-200"
                style={{
                  width: idx === currentReelIndex 
                    ? `${progressPercentage}%` 
                    : idx < currentReelIndex ? "100%" : "0%"
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Badge 
              variant="outline" 
              className="bg-black/40 text-white border-white/30 text-xs px-2.5 py-0.5 backdrop-blur-md font-semibold tracking-wide"
            >
              <span className="mr-1.5">{currentReel.emoji}</span>
              {currentReel.disaster}
            </Badge>

            {/* Active Mode Switcher: Interactive Drill vs Watch */}
            <div className="bg-black/40 border border-white/20 p-0.5 rounded-lg flex items-center">
              <button
                onClick={() => {
                  playTone(480, "sine", 0.1);
                  setActiveMode("drill");
                }}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-all ${
                  activeMode === "drill" ? "bg-primary text-white shadow-sm" : "text-white/70 hover:text-white"
                }`}
              >
                🎮 Drill Mode
              </button>
              <button
                onClick={() => {
                  playTone(400, "sine", 0.1);
                  setActiveMode("watch");
                }}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-all ${
                  activeMode === "watch" ? "bg-primary text-white shadow-sm" : "text-white/70 hover:text-white"
                }`}
              >
                ▶️ Watch
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Voice Narration Audio Toggle */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                const nextState = !isVoiceNarratorEnabled;
                setIsVoiceNarratorEnabled(nextState);
                playTone(nextState ? 600 : 300, "sine", 0.15);
                toast({
                  title: nextState ? "🔊 Voice Narration ON" : "🔇 Voice Narration Muted",
                  description: nextState ? "Survival instructions will be read aloud automatically." : "Audio muted.",
                });
              }}
              className="w-7 h-7 rounded-full bg-black/40 text-white hover:bg-black/60 border border-white/20"
              title={isVoiceNarratorEnabled ? "Mute Voice" : "Enable Voice Narration"}
            >
              {isVoiceNarratorEnabled ? <Volume2 className="w-3.5 h-3.5 text-green-400" /> : <VolumeX className="w-3.5 h-3.5 text-white/70" />}
            </Button>

            {/* Play/Pause */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-7 h-7 rounded-full bg-black/40 text-white hover:bg-black/60 border border-white/20"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Center Stage: Interactive Simulator vs Watch View */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 overflow-y-auto">
        {activeMode === "drill" ? (
          renderInteractiveDrill()
        ) : (
          <div 
            className="flex flex-col items-center text-center cursor-pointer"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-5xl shadow-2xl mb-3 transform hover:scale-105 transition-transform">
              <span>{currentReel.emoji}</span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white drop-shadow-md">
              {currentReel.title}
            </h2>
            <p className="text-xs text-white/80 font-medium max-w-xs mt-0.5">
              {currentReel.subtitle}
            </p>
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                setActiveMode("drill");
              }}
              className="mt-3 bg-primary text-white font-bold text-xs"
            >
              🎮 Tap to Start Interactive Drill
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

        {/* Quick Quiz */}
        <button
          onClick={() => setIsQuizOpen(true)}
          className="group flex flex-col items-center transition-transform active:scale-75"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/90 backdrop-blur-md border border-primary-foreground/30 text-white hover:bg-primary shadow-lg shadow-primary/30">
            <HelpCircle className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold mt-0.5 text-white/90 drop-shadow">Quiz</span>
        </button>
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

      {/* Bottom Subtitle / Interactive Step Instruction Box */}
      <div className="relative z-20 px-4 pb-3 pt-2 bg-gradient-to-t from-black via-black/85 to-transparent">
        <div className="mr-14 bg-black/55 backdrop-blur-md border border-white/15 p-2.5 rounded-xl shadow-lg transition-all">
          <div className="flex items-center justify-between mb-1">
            {/* Step Selection Buttons: User can tap to scrub directly to step! */}
            <div className="flex items-center gap-1">
              {currentReel.steps.map((st) => (
                <button
                  key={st.stepNumber}
                  onClick={() => {
                    setElapsedTime(st.startTime);
                    playTone(400 + st.stepNumber * 50, "sine", 0.1);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                    activeStep.stepNumber === st.stepNumber 
                      ? "bg-white text-black font-extrabold" 
                      : "bg-white/15 text-white/70 hover:bg-white/30"
                  }`}
                >
                  Step {st.stepNumber}
                </button>
              ))}
            </div>

            {onNavigate && (
              <Button
                variant="link"
                size="sm"
                onClick={() => onNavigate("learning")}
                className="text-[10px] text-white/80 p-0 h-auto font-medium hover:text-white"
              >
                <BookOpen className="w-3 h-3 mr-1" />
                Guide
              </Button>
            )}
          </div>

          <p className="text-xs text-white font-medium leading-snug">
            <strong>{activeStep.headline}:</strong> {activeStep.instruction}
          </p>
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

      {/* Quick Check Quiz Dialog */}
      <Dialog open={isQuizOpen} onOpenChange={setIsQuizOpen}>
        <DialogContent className="max-w-sm p-4 bg-card text-card-foreground">
          <DialogHeader className="pb-2 border-b">
            <DialogTitle className="text-base flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" />
              Quick Check: {currentReel.disaster}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Test what you just learned in this reel!
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 space-y-3">
            <p className="text-sm font-semibold leading-snug">
              {currentReel.quiz.question}
            </p>

            <div className="space-y-2">
              {currentReel.quiz.options.map((opt, idx) => {
                let btnStyle = "bg-muted text-foreground hover:bg-muted/80";
                if (hasAnsweredQuiz) {
                  if (idx === currentReel.quiz.correctIndex) {
                    btnStyle = "bg-green-600 text-white hover:bg-green-600";
                  } else if (idx === selectedQuizAnswer) {
                    btnStyle = "bg-destructive text-destructive-foreground";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={hasAnsweredQuiz}
                    onClick={() => handleQuizAnswer(idx)}
                    className={`w-full p-2.5 rounded-lg text-xs font-medium text-left transition-all flex items-center justify-between border ${btnStyle}`}
                  >
                    <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                    {hasAnsweredQuiz && idx === currentReel.quiz.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-2" />
                    )}
                    {hasAnsweredQuiz && idx === selectedQuizAnswer && idx !== currentReel.quiz.correctIndex && (
                      <XCircle className="w-4 h-4 text-white shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {hasAnsweredQuiz && (
              <div className="p-2.5 rounded-lg bg-muted text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">
                  {selectedQuizAnswer === currentReel.quiz.correctIndex ? "🎉 Correct!" : "💡 Explanation:"}
                </p>
                <p>{currentReel.quiz.explanation}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              size="sm" 
              onClick={() => {
                setIsQuizOpen(false);
                setSelectedQuizAnswer(null);
                setHasAnsweredQuiz(false);
              }}
              className="w-full"
            >
              Continue Watching
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Reels;
