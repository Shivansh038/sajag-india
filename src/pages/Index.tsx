import { useState, useEffect } from "react";
import { AlertTriangle, Phone, Book, MapPin, Users, Shield, Gamepad2, HelpCircle, FileText, Map, Play, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import OnboardingScreen from "@/components/OnboardingScreen";
import HomeScreen from "@/components/HomeScreen";
import AlertsScreen from "@/components/AlertsScreen";
import EmergencyDirectory from "@/components/EmergencyDirectory";
import LearningModules from "@/components/LearningModules";
import AdminDashboard from "@/components/AdminDashboard";
import Games from "@/components/Games";
import Quizzes from "@/components/Quizzes";
import Modules from "@/components/Modules";
import Maps from "@/components/Maps";
import Reels from "@/components/Reels";
import PreparednessLevels from "@/components/PreparednessLevels";

type UserType = "student" | "teacher" | "admin";
type Screen = "onboarding" | "home" | "alerts" | "emergency" | "learning" | "admin" | "games" | "quizzes" | "modules" | "maps" | "reels" | "preparedness";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding");
  const [userType, setUserType] = useState<UserType>("student");
  const [userState, setUserState] = useState<string>("Uttar Pradesh");
  const [userRegion, setUserRegion] = useState<string>("");
  const [userCity, setUserCity] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sajag_user");
      if (saved) {
        const data = JSON.parse(saved);
        if (data && data.userType) {
          setUserType(data.userType);
          setUserState(data.state || "Uttar Pradesh");
          setUserRegion(data.region || "");
          setUserCity(data.city || "");
          setUserId(data.userId || "local_user");
          setIsOnboarded(true);
          setCurrentScreen("home");
        }
      }
    } catch (e) {
      console.warn("Could not load saved user profile", e);
    }
  }, []);

  const handleOnboardingComplete = (selectedUserType: UserType, state: string, region: string, city: string, completedUserId: string) => {
    setUserType(selectedUserType);
    setUserState(state || "Uttar Pradesh");
    setUserRegion(region);
    setUserCity(city);
    setUserId(completedUserId);
    setIsOnboarded(true);
    setCurrentScreen("home");
  };

  const handleStateChange = (newState: string) => {
    setUserState(newState);
    try {
      const saved = localStorage.getItem("sajag_user");
      const data = saved ? JSON.parse(saved) : {};
      data.state = newState;
      localStorage.setItem("sajag_user", JSON.stringify(data));
    } catch (e) {
      console.warn("Could not persist state change", e);
    }
  };

  const getNavigationItems = () => {
    if (userType === "student") {
      return [
        { id: "home" as Screen, icon: Shield, label: "Home", color: "bg-primary" },
        { id: "alerts" as Screen, icon: AlertTriangle, label: "Alert", color: "bg-alert-critical" },
        { id: "emergency" as Screen, icon: Phone, label: "Emergency", color: "bg-alert-info" },
        { id: "learning" as Screen, icon: Book, label: "Learn", color: "bg-achievement" },
        { id: "reels" as Screen, icon: Play, label: "Reels", color: "bg-accent" },
      ];
    } else if (userType === "teacher") {
      return [
        { id: "home" as Screen, icon: Shield, label: "Home", color: "bg-primary" },
        { id: "alerts" as Screen, icon: AlertTriangle, label: "Alerts", color: "bg-alert-critical" },
        { id: "emergency" as Screen, icon: Phone, label: "Emergency", color: "bg-alert-info" },
        { id: "admin" as Screen, icon: BarChart3, label: "Dashboard", color: "bg-accent" },
      ];
    } else { // admin
      return [
        { id: "preparedness" as Screen, icon: Shield, label: "Preparedness", color: "bg-primary" },
        { id: "alerts" as Screen, icon: AlertTriangle, label: "Alerts", color: "bg-alert-critical" },
        { id: "emergency" as Screen, icon: Phone, label: "Emergency", color: "bg-alert-info" },
        { id: "admin" as Screen, icon: BarChart3, label: "Dashboard", color: "bg-accent" },
      ];
    }
  };

  const navigationItems = getNavigationItems();

  if (!isOnboarded) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile App Container */}
      <div className="max-w-md mx-auto bg-card shadow-lg min-h-screen relative">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-4 py-3 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold tracking-tight">Sajag</h1>
              <p className="text-xs opacity-90">Stay Safe. Stay Prepared.</p>
            </div>
            {userState && (
              <Badge 
                variant="outline" 
                className="bg-primary-foreground/15 text-primary-foreground text-xs border-primary-foreground/30 flex items-center gap-1 cursor-pointer hover:bg-primary-foreground/25"
                onClick={() => setCurrentScreen("alerts")}
              >
                <MapPin className="w-3 h-3" />
                <span>{userCity ? `${userCity}, ` : ""}{userState}</span>
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className={currentScreen === "reels" ? "pb-16" : "pb-24"}>
          {currentScreen === "home" && (
            <HomeScreen 
              userType={userType} 
              state={userState} 
              region={userRegion} 
              city={userCity} 
              userId={userId} 
              onNavigate={(s) => setCurrentScreen(s as Screen)}
            />
          )}
          {currentScreen === "alerts" && (
            <AlertsScreen 
              userState={userState} 
              userCity={userCity} 
              onNavigate={(s) => setCurrentScreen(s as Screen)}
              onStateChange={handleStateChange}
            />
          )}
          {currentScreen === "emergency" && (
            <EmergencyDirectory 
              userState={userState} 
              userCity={userCity} 
            />
          )}
          {currentScreen === "learning" && (
            <LearningModules 
              userType={userType} 
              userState={userState} 
            />
          )}
          {currentScreen === "games" && <Games onBack={() => setCurrentScreen("learning")} />}
          {currentScreen === "quizzes" && <Quizzes onBack={() => setCurrentScreen("learning")} />}
          {currentScreen === "modules" && <Modules onBack={() => setCurrentScreen("learning")} userId={userId || "local_user"} />}
          {currentScreen === "maps" && <Maps onBack={() => setCurrentScreen("learning")} userState={userState} />}
          {currentScreen === "reels" && <Reels onNavigate={(s) => setCurrentScreen(s as Screen)} />}
          {currentScreen === "preparedness" && <PreparednessLevels />}
          {currentScreen === "admin" && (userType === "admin" || userType === "teacher") && (
            <AdminDashboard userType={userType} />
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-card border-t border-border z-40">
          <div className="flex justify-around items-center py-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentScreen(item.id)}
                  className={`flex flex-col items-center p-2 h-auto ${
                    currentScreen === item.id
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground"
                  }`}
                >
                  <div className={`p-1 rounded-md ${currentScreen === item.id ? item.color : ""}`}>
                    <Icon size={20} className={currentScreen === item.id ? "text-white" : ""} />
                  </div>
                  <span className="text-xs mt-1">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
