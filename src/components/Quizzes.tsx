import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, RefreshCw, Check, X, BookOpen, ChevronLeft } from "lucide-react";

interface QuizProps {
  onQuizComplete: (score: number, total: number) => void;
  onBack: () => void;
}

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
    options: ["First-aid kit", "Rope", "Important documents", "Extra clothes"],
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

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const Quizzes = ({ onBack }: { onBack: () => void }) => {
  const [quizState, setQuizState] = useState<"intro" | "playing" | "results">("intro");
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    // Shuffle the questions when the component mounts
    setShuffledQuestions(shuffleArray([...quizQuestions]));
  }, []);

  const handleStartQuiz = () => {
    setQuizState("playing");
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswers([]);
    setShuffledQuestions(shuffleArray([...quizQuestions]));
  };

  const handleAnswerClick = (selectedOption: string) => {
    if (showAnswer) return; // Prevent multiple answers
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.answer;
    
    setUserAnswers(prev => [...prev, selectedOption]);
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setShowAnswer(true);

    setTimeout(() => {
      setShowAnswer(false);
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setQuizState("results");
      }
    }, 1500); // Wait 1.5 seconds before moving to the next question
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  if (quizState === "intro") {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full">
        <Button variant="ghost" size="sm" onClick={onBack} className="absolute top-4 left-4">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Card className="max-w-sm w-full text-center">
          <CardHeader>
            <BookOpen className="w-10 h-10 text-primary mx-auto mb-2" />
            <CardTitle>Disaster Preparedness Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Test your knowledge on disaster safety, preparedness, and response.
            </p>
            <Button onClick={handleStartQuiz} className="w-full">
              Begin Quiz <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizState === "results") {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full">
        <Card className="max-w-sm w-full text-center">
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-4xl font-bold mb-4">
              {score} / {shuffledQuestions.length}
            </p>
            <p className="mb-4">
              You scored **{score}** out of **{shuffledQuestions.length}**.
            </p>
            <Button onClick={handleStartQuiz} className="w-full mb-2">
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

  return (
    <div className="p-4 space-y-4 h-full">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {currentQuestionIndex + 1} / {shuffledQuestions.length}
          </Badge>
          <span className="text-sm font-medium">Score: {score}</span>
        </div>
      </div>
      
      <Card className="min-h-[250px]">
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {shuffleArray([...currentQuestion.options]).map((option) => (
            <Button
              key={option}
              variant={
                showAnswer
                  ? option === currentQuestion.answer
                    ? "default"
                    : userAnswers[currentQuestionIndex] === option
                    ? "destructive"
                    : "outline"
                  : "outline"
              }
              className="w-full justify-start text-left h-auto py-3 relative"
              onClick={() => handleAnswerClick(option)}
              disabled={showAnswer}
            >
              {option}
              {showAnswer && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {option === currentQuestion.answer ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : userAnswers[currentQuestionIndex] === option ? (
                    <X className="w-5 h-5 text-white" />
                  ) : null}
                </div>
              )}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Quizzes;