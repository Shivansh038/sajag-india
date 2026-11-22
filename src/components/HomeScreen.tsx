import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, Phone, Book, MapPin, Shield, 
  Clock, Zap, Users, TrendingUp, CheckCircle, ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAlertsForLocation } from "@/lib/alertsData";

interface HomeScreenProps {
  userType: "student" | "teacher" | "admin";
  state: string;
  region: string;
  city: string;
  userId: string | null;
  onNavigate?: (screen: string) => void;
}

const HomeScreen = ({ userType, state, region, city, userId, onNavigate }: HomeScreenProps) => {
  const [learningProgress, setLearningProgress] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [isMarkedSafe, setIsMarkedSafe] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (userId && userType === "student") {
      fetchLearningProgress();
    } else {
      setLearningProgress(0);
      setQuizCompleted(false);
      setIsLoadingProgress(false);
    }

    // Check if user was marked safe recently
    const safeStatus = localStorage.getItem("sajag_safe_status");
    if (safeStatus) {
      setIsMarkedSafe(true);
    }
  }, [userId, userType]);

  const fetchLearningProgress = async () => {
    setIsLoadingProgress(true);
    try {
      const response = await fetch(`http://localhost:8000/learning_progress/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setLearningProgress(data.progress);
        setQuizCompleted(data.quiz_completed);
        setIsLoadingProgress(false);
        return;
      }
    } catch {
      // Backend not running, use local storage fallback
    }

    try {
      const localProgress = localStorage.getItem("sajag_progress");
      if (localProgress) {
        const parsed = JSON.parse(localProgress);
        setLearningProgress(parsed.progress || 0);
        setQuizCompleted(parsed.quiz_completed || false);
      }
    } catch {
      // Default to initial state
    } finally {
      setIsLoadingProgress(false);
    }
  };
  
  // Fetch real, verified alerts for user's actual state and city
  const localAlerts = useMemo(() => {
    const list = getAlertsForLocation(state || "Uttar Pradesh", city);
    return list.slice(0, 2); // Show top 2 active alerts on home screen
  }, [state, city]);

  const quickActions = [
    {
      icon: Phone,
      label: "Emergency Call",
      action: "emergency",
      color: "bg-alert-critical",
      description: "Call 112"
    },
    {
      icon: Book,
      label: "Safety Guide",
      action: "learning",
      color: "bg-achievement", 
      description: "Learn basics"
    },
    {
      icon: MapPin,
      label: "Evacuation Map",
      action: "maps",
      color: "bg-alert-info",
      description: "Find exits"
    },
    {
      icon: Shield,
      label: isMarkedSafe ? "You Are Safe" : "Safety Check",
      action: "check",
      color: "bg-alert-safe",
      description: isMarkedSafe ? "Status verified" : "Mark safe"
    }
  ];

  const handleQuickAction = (actionType: string) => {
    if (actionType === "emergency") {
      if (onNavigate) {
        onNavigate("emergency");
      } else {
        window.location.href = "tel:112";
      }
    } else if (actionType === "learning") {
      if (onNavigate) onNavigate("learning");
    } else if (actionType === "maps") {
      if (onNavigate) onNavigate("maps");
    } else if (actionType === "check") {
      setIsMarkedSafe(true);
      localStorage.setItem("sajag_safe_status", JSON.stringify({
        safe: true,
        timestamp: new Date().toISOString(),
        location: `${city || ""}, ${state || ""}`
      }));
      toast({
        title: "✅ Marked Safe!",
        description: `Your safety status for ${city ? city + ", " : ""}${state || "your institution"} has been confirmed.`
      });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-alert-safe";
    if (score >= 60) return "text-alert-warning";
    return "text-alert-critical";
  };

  return (
    <div className="p-4 space-y-4">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{getGreeting()}</h2>
              <p className="text-sm opacity-90 capitalize">
                Welcome back, {userType}
              </p>
              <div className="flex items-center mt-1 text-xs opacity-90 font-medium">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                <span>{city ? `${city}, ` : ""}{region ? `${region}, ` : ""}{state || "Uttar Pradesh"}</span>
              </div>
            </div>
            <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
              <Shield className="w-7 h-7 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Score */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Preparedness Level</CardTitle>
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              {quizCompleted ? "Quiz Completed" : "+5% this week"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-2">
            <span className={`text-2xl font-bold ${getScoreColor(learningProgress)}`}>
              {isLoadingProgress ? "..." : learningProgress.toFixed(0)}%
            </span>
            <span className="text-sm text-muted-foreground ml-2">
              {learningProgress >= 80 ? "Well Prepared!" : "Complete modules to improve"}
            </span>
          </div>
          <Progress value={learningProgress} className="h-2" />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-muted-foreground">
              {quizCompleted ? "All safety knowledge verified" : "Take safety quiz & modules to reach 100%"}
            </p>
            {onNavigate && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs text-primary p-0"
                onClick={() => onNavigate("learning")}
              >
                Learn Now <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Live Alerts - Filtered for User's State */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center">
              <Zap className="w-4 h-4 mr-2 text-alert-warning" />
              Live Alerts in {state || "Your Region"}
            </CardTitle>
            {onNavigate && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-primary font-medium"
                onClick={() => onNavigate("alerts")}
              >
                View All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {localAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className="flex items-start space-x-3 p-2.5 rounded-lg bg-muted/60 hover:bg-muted cursor-pointer transition-all border border-border/50"
              onClick={() => onNavigate && onNavigate("alerts")}
            >
              <AlertTriangle 
                className={`w-4 h-4 mt-0.5 shrink-0 ${
                  alert.type === "critical" ? "text-alert-critical" :
                  alert.type === "warning" ? "text-alert-warning" : "text-alert-info"
                }`} 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-xs font-bold truncate">{alert.title}</p>
                  <Badge 
                    variant={alert.type === "critical" ? "destructive" : "secondary"}
                    className="text-[10px] px-1.5 py-0 h-4"
                  >
                    {alert.type.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                  {alert.description}
                </p>
                <p className="text-[10px] text-muted-foreground flex items-center mt-1">
                  <MapPin className="w-2.5 h-2.5 mr-1 text-primary shrink-0" />
                  <span className="truncate">{alert.location}</span>
                  <Clock className="w-2.5 h-2.5 ml-2 mr-0.5 shrink-0" />
                  <span>Recent</span>
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleQuickAction(action.action)}
                  className="h-auto p-3 flex flex-col items-center space-y-2 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className={`p-2 rounded-full ${action.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity - For Admins/Teachers */}
      {(userType === "admin" || userType === "teacher") && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Users className="w-4 h-4 mr-2 text-primary" />
              Recent Institutional Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs p-1.5 bg-muted/40 rounded">
                <span>🔥 Fire evacuation drill completed - Class 10A</span>
                <span className="text-muted-foreground">1h ago</span>
              </div>
              <div className="flex items-center justify-between text-xs p-1.5 bg-muted/40 rounded">
                <span>🫨 25 students completed earthquake module</span>
                <span className="text-muted-foreground">3h ago</span>
              </div>
              <div className="flex items-center justify-between text-xs p-1.5 bg-muted/40 rounded">
                <span>📢 Localized safety warning issued for {state}</span>
                <span className="text-muted-foreground">Today</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HomeScreen;
