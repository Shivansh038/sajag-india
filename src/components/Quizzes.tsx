import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, RefreshCw, Check, X, BookOpen, ChevronLeft, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  question: string;
  options: string[];
  answer: string;
  disaster: string;
}

const quizQuestions: Question[] = [
  {
    question: "What is the primary cause of tsunamis?",
    options: ["Underwater earthquakes", "Strong winds", "Volcanic eruptions on land", "Heavy rainfall"],
    answer: "Underwater earthquakes",
    disaster: "tsunamis"
  },
  {
    question: "What is the safest place to be during an earthquake indoors?",
    options: ["Near a window", "In an elevator", "Under a sturdy table or desk", "Next to a tall bookshelf"],
    answer: "Under a sturdy table or desk",
    disaster: "earthquake"
  },
  {
    question: "Which of these items is NOT essential for a basic disaster safety kit?",
    options: ["First-aid kit", "Drinking water", "Important documents", "A large television"],
    answer: "A large television",
    disaster: "safety kit"
  },
  {
    question: "During a flood, what is the most important rule to follow?",
    options: ["Attempt to drive through floodwaters", "Stay in your car", "Do not walk or drive through floodwaters", "Swim to safety"],
    answer: "Do not walk or drive through floodwaters",
    disaster: "flood"
  },
  {
    question: "A cyclone is characterized by...",
    options: ["A clear sky and gentle breeze", "Rapidly rotating air around a low-pressure center", "Heavy snowfall", "A sudden rise in temperature"],
    answer: "Rapidly rotating air around a low-pressure center",
    disaster: "cyclone"
  },
  {
    question: "What is the best action to take immediately after a fire has been extinguished?",
    options: ["Go back inside to check for personal belongings", "Stay outside and call emergency services", "Open all windows to air out the smoke", "Wait for the fire to restart before acting"],
    answer: "Stay outside and call emergency services",
    disaster: "fire"
  },
  {
    question: "What should you do immediately after an earthquake?",
    options: ["Turn on the electricity", "Evacuate if your building is damaged", "Go outside to see what happened", "Re-enter the building to check for family"],
    answer: "Evacuate if your building is damaged",
    disaster: "earthquake"
  },
  {
    question: "What is the main danger of a heatwave?",
    options: ["Hypothermia", "Dehydration and heatstroke", "Frostbite", "Flash floods"],
    answer: "Dehydration and heatstroke",
    disaster: "heatwave"
  },
  {
    question: "What should be the first item in your disaster safety kit?",
    options: ["Extra clothes", "Water and non-perishable food", "A portable radio", "A flashlight"],
    answer: "Water and non-perishable food",
    disaster: "safety kit"
  },
  {
    question: "During a cyclone, what should you do if you are outdoors?",
    options: ["Seek shelter in a tall tree", "Lie down in a ditch or low-lying area", "Stand near a power pole", "Run to the nearest building"],
    answer: "Lie down in a ditch or low-lying area",
    disaster: "cyclone"
  },
  {
    question: "What is a key difference between a tsunami and a regular wave?",
    options: ["Tsunamis are smaller", "Tsunamis are caused by wind", "Tsunamis are caused by underwater geological events", "Regular waves are faster"],
    answer: "Tsunamis are caused by underwater geological events",
    disaster: "tsunamis"
  },
  {
    question: "What is the 'Stop, Drop, and Roll' technique used for?",
    options: ["During an earthquake", "If your clothes catch fire", "When caught in a flood", "To prepare for a cyclone"],
    answer: "If your clothes catch fire",
    disaster: "fire"
  },
  {
    question: "What should you do before a flood is expected?",
    options: ["Leave your doors and windows open", "Move important belongings to a higher floor", "Stay in your basement", "Park your car in a low-lying area"],
    answer: "Move important belongings to a higher floor",
    disaster: "flood"
  },
  {
    question: "What is a major cause of heatwaves?",
    options: ["Volcanic activity", "Lack of wind", "High-pressure systems trapping heat", "Tidal forces"],
    answer: "High-pressure systems trapping heat",
    disaster: "heatwave"
  },
  {
    question: "If you are indoors during a fire, what is the best way to get out?",
    options: ["Crawl low to the ground", "Run as fast as you can to the exit", "Use an elevator", "Stay standing to see better"],
    answer: "Crawl low to the ground",
    disaster: "fire"
  },
  {
    question: "After a cyclone has passed, what is the first thing you should do?",
    options: ["Go outside to assess the damage", "Turn on your television", "Check on neighbors and family", "Touch any loose wires or broken power lines"],
    answer: "Check on neighbors and family",
    disaster: "cyclone"
  },
  {
    question: "Which of these is a sign of heatstroke?",
    options: ["Shivering", "Pale, cool skin", "High body temperature and confusion", "Increased appetite"],
    answer: "High body temperature and confusion",
    disaster: "heatwave"
  },
  {
    question: "What is a common safety tip for a safety kit?",
    options: ["Store it in your garage", "Check and replace expired items annually", "Keep it in a locked box", "Fill it with luxury items"],
    answer: "Check and replace expired items annually",
    disaster: "safety kit"
  },
  {
    question: "What should you do if a tsunami warning is issued?",
    options: ["Go to the beach to watch the waves", "Immediately move to higher ground inland", "Stay in your home and close the doors", "Go to the coast and get in a boat"],
    answer: "Immediately move to higher ground inland",
    disaster: "tsunamis"
  },
  {
    question: "After a flood, what is a primary safety concern?",
    options: ["The water level", "The presence of mold and contaminated water", "The weather forecast", "The state of the roads"],
    answer: "The presence of mold and contaminated water",
    disaster: "flood"
  },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface QuizzesProps {
  onBack: () => void;
  onQuizComplete?: (score: number, total: number) => void;
}

const Quizzes = ({ onBack, onQuizComplete }: QuizzesProps) => {
  const [quizState, setQuizState] = useState<"intro" | "playing" | "results">("intro");
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setShuffledQuestions(shuffleArray(quizQuestions).slice(0, 5)); // 5 questions per quiz session
  }, []);

  const handleStartQuiz = () => {
    setQuizState("playing");
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswers([]);
    setShuffledQuestions(shuffleArray(quizQuestions).slice(0, 5));
  };

  const handleAnswerClick = (selectedOption: string) => {
    if (showAnswer) return;
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.answer;
    
    setUserAnswers(prev => [...prev, selectedOption]);
    const updatedScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
      setScore(updatedScore);
    }
    
    setShowAnswer(true);

    setTimeout(() => {
      setShowAnswer(false);
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Quiz complete!
        setQuizState("results");
        if (onQuizComplete) {
          onQuizComplete(updatedScore, shuffledQuestions.length);
        }

        // Save progress to localStorage
        try {
          const prevProgressStr = localStorage.getItem("sajag_progress");
          const prevProgress = prevProgressStr ? JSON.parse(prevProgressStr) : { progress: 0 };
          const calculatedPct = Math.min(100, Math.max(prevProgress.progress || 0, Math.round((updatedScore / shuffledQuestions.length) * 100)));
          
          localStorage.setItem("sajag_progress", JSON.stringify({
            progress: calculatedPct,
            quiz_completed: true,
            score: updatedScore,
            total: shuffledQuestions.length,
            completedAt: new Date().toISOString()
          }));
        } catch (e) {
          console.warn("Could not save quiz progress", e);
        }

        toast({
          title: "🎉 Quiz Completed!",
          description: `You scored ${updatedScore} out of ${shuffledQuestions.length}. Safety preparedness score updated!`,
        });
      }
    }, 1200);
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  if (quizState === "intro") {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[400px]">
        <Button variant="ghost" size="sm" onClick={onBack} className="self-start mb-4">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Card className="max-w-sm w-full text-center shadow-md">
          <CardHeader>
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-2" />
            <CardTitle className="text-xl">Disaster Preparedness Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Test your knowledge on disaster safety, early warnings, and emergency survival measures.
            </p>
            <div className="bg-muted p-3 rounded-md text-xs text-left space-y-1">
              <p>⏱️ <strong>5 Questions</strong> per session</p>
              <p>🎯 Immediate feedback on each question</p>
              <p>📈 Updates your Home Screen preparedness score</p>
            </div>
            <Button onClick={handleStartQuiz} className="w-full font-bold">
              Begin Quiz <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizState === "results") {
    const percentage = Math.round((score / shuffledQuestions.length) * 100);
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[400px]">
        <Card className="max-w-sm w-full text-center shadow-lg border-2 border-primary/20">
          <CardHeader>
            <Award className="w-12 h-12 text-achievement mx-auto mb-2" />
            <CardTitle className="text-xl">Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-4xl font-extrabold text-primary mb-1">
                {score} / {shuffledQuestions.length}
              </p>
              <Badge variant={percentage >= 60 ? "default" : "destructive"}>
                {percentage}% Preparedness Score
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {percentage >= 80 
                ? "Excellent! You are well prepared to respond effectively in disaster emergencies."
                : percentage >= 60
                ? "Good job! Review the disaster modules to strengthen your response tactics."
                : "Keep learning! Check out the interactive emergency modules to build life-saving skills."}
            </p>
            <Button onClick={handleStartQuiz} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" /> Retake Quiz
            </Button>
            <Button onClick={onBack} variant="outline" className="w-full">
              Back to Learning
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
          </Badge>
          <span className="text-sm font-semibold text-primary">Score: {score}</span>
        </div>
      </div>
      
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-1">
            <Badge variant="outline" className="text-xs uppercase tracking-wide">
              {currentQuestion.disaster}
            </Badge>
          </div>
          <CardTitle className="text-base leading-snug">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = userAnswers[currentQuestionIndex] === option;
            const isCorrectAnswer = option === currentQuestion.answer;
            
            let btnVariant: "outline" | "default" | "destructive" = "outline";
            let extraClass = "hover:bg-muted text-left justify-start";

            if (showAnswer) {
              if (isCorrectAnswer) {
                btnVariant = "default";
                extraClass = "bg-green-600 hover:bg-green-600 text-white border-green-600";
              } else if (isSelected && !isCorrectAnswer) {
                btnVariant = "destructive";
                extraClass = "bg-destructive text-destructive-foreground";
              }
            }

            return (
              <Button
                key={idx}
                variant={btnVariant}
                disabled={showAnswer}
                onClick={() => handleAnswerClick(option)}
                className={`w-full py-3 h-auto min-h-[44px] text-sm whitespace-normal transition-all ${extraClass}`}
              >
                <div className="flex items-center w-full">
                  <span className="mr-3 font-bold text-xs opacity-70 w-5">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span className="flex-1">{option}</span>
                  {showAnswer && isCorrectAnswer && (
                    <Check className="w-4 h-4 ml-2 text-white shrink-0" />
                  )}
                  {showAnswer && isSelected && !isCorrectAnswer && (
                    <X className="w-4 h-4 ml-2 text-white shrink-0" />
                  )}
                </div>
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default Quizzes;
