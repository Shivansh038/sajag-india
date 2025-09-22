import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, Phone, Book, MapPin, Shield, 
  Clock, Zap, Users, TrendingUp 
} from "lucide-react";

interface HomeScreenProps {
  userType: "student" | "teacher" | "admin";
  state: string;
  region: string;
  city: string;
  userId: string | null;
}

const HomeScreen = ({ userType, state, region, city, userId }: HomeScreenProps) => {
  const [learningProgress, setLearningProgress] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  
  useEffect(() => {
    if (userId && userType === "student") {
      fetchLearningProgress();
    } else {
      // For non-students, we can assume a default progress or handle differently
      setLearningProgress(0);
      setQuizCompleted(false);
      setIsLoadingProgress(false);
    }
  }, [userId, userType]);

  const fetchLearningProgress = async () => {
    setIsLoadingProgress(true);
    try {
      const response = await fetch(`http://localhost:8000/learning_progress/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch learning progress");
      }
      const data = await response.json();
      setLearningProgress(data.progress);
      setQuizCompleted(data.quiz_completed);
    } catch (error) {
      console.error("Error fetching learning progress:", error);
    } finally {
      setIsLoadingProgress(false);
    }
  };
  
  const alerts = [
    {
      type: "warning",
      title: "Heavy Rain Alert",
      location: "Delhi NCR",
      time: "2 hours ago",
      severity: "Medium"
    },
    {
      type: "info", 
      title: "Earthquake Drill Scheduled",
      location: "Your Institution",
      time: "Tomorrow 10 AM",
      severity: "Info"
    }
  ];

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
      action: "emergency",
      color: "bg-alert-info",
      description: "Find exits"
    },
    {
      icon: Shield,
      label: "Safety Check",
      action: "check",
      color: "bg-alert-safe",
      description: "Mark safe"
    }
  ];

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
      <Card className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{getGreeting()}</h2>
              <p className="text-sm opacity-90 capitalize">
                Welcome back, {userType}
              </p>
              <div className="flex items-center mt-1 text-xs opacity-80">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{city}, {region}</span>
              </div>
            </div>
            <Shield className="w-8 h-8 opacity-80" />
          </div>
        </CardContent>
      </Card>

      {/* Safety Score */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Preparedness Level</CardTitle>
            <Badge variant="secondary">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5% this week
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-2">
            <span className={`text-2xl font-bold ${getScoreColor(learningProgress)}`}>
              {isLoadingProgress ? "..." : learningProgress.toFixed(0)}%
            </span>
            <span className="text-sm text-muted-foreground ml-2">
              Keep it up!
            </span>
          </div>
          <Progress value={learningProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Complete learning modules to improve your score
          </p>
        </CardContent>
      </Card>

      {/* Live Alerts */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center">
              <Zap className="w-4 h-4 mr-2 text-alert-warning" />
              Live Alerts
            </CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {alerts.map((alert, index) => (
            <div key={index} className="flex items-start space-x-3 p-2 rounded-lg bg-muted/50">
              <AlertTriangle 
                className={`w-4 h-4 mt-0.5 ${
                  alert.type === "warning" ? "text-alert-warning" : "text-alert-info"
                }`} 
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{alert.title}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {alert.location}
                  <Clock className="w-3 h-3 ml-2 mr-1" />
                  {alert.time}
                </p>
              </div>
              <Badge 
                variant={alert.severity === "Medium" ? "destructive" : "secondary"}
                className="text-xs"
              >
                {alert.severity}
              </Badge>
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
                  className="h-auto p-3 flex flex-col items-center space-y-2 hover:shadow-md transition-all"
                >
                  <div className={`p-2 rounded-full ${action.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{action.label}</p>
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
              <Users className="w-4 h-4 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Fire drill completed - Class 10A</span>
                <span className="text-muted-foreground">1h ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>25 students completed earthquake module</span>
                <span className="text-muted-foreground">3h ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>New safety alert published</span>
                <span className="text-muted-foreground">5h ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HomeScreen;