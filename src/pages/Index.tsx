import { useState } from "react";
import { AlertTriangle, Phone, Book, MapPin, Users, Shield, MessageCircle, Gamepad2, HelpCircle, FileText, Map, Play, BarChart3 } from "lucide-react";
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
import ChatBot from "@/components/ChatBot";
import Games from "@/components/Games";
import Quizzes from "@/components/Quizzes";
import Modules from "@/components/Modules";
import Maps from "@/components/Maps";
import Reels from "@/components/Reels";
import PreparednessLevels from "@/components/PreparednessLevels";

type UserType = "student" | "teacher" | "admin";
type Screen = "onboarding" | "home" | "alerts" | "emergency" | "learning" | "admin" | "games" | "quizzes" | "modules" | "maps" | "reels" | "chatbot" | "preparedness";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding");
  const [userType, setUserType] = useState<UserType>("student");
  const [userState, setUserState] = useState<string>("");
  const [userRegion, setUserRegion] = useState<string>("");
  const [userCity, setUserCity] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const handleOnboardingComplete = (selectedUserType: UserType, state: string, region: string, city: string, completedUserId: string) => {
    setUserType(selectedUserType);
    setUserState(state);
    setUserRegion(region);
    setUserCity(city);
    setUserId(completedUserId);
    setIsOnboarded(true);
    setCurrentScreen("home");
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
        <div className="bg-primary text-primary-foreground p-4 text-center">
          <h1 className="text-lg font-bold">Sajag</h1>
          <p className="text-sm opacity-90">Stay Safe. Stay Prepared.</p>
        </div>

        {/* Main Content */}
        <div className="pb-20">
          {currentScreen === "home" && <HomeScreen userType={userType} state={userState} region={userRegion} city={userCity} />}
          {currentScreen === "alerts" && <AlertsScreen userState={userState} />}
          {currentScreen === "emergency" && <EmergencyDirectory />}
          {currentScreen === "learning" && <LearningModules userType={userType} userState={userState} />}
          {currentScreen === "games" && <Games onBack={() => setCurrentScreen("learning")} />}
          {currentScreen === "quizzes" && <Quizzes onBack={() => setCurrentScreen("learning")} />}
          {currentScreen === "modules" && <Modules onBack={() => setCurrentScreen("learning")} />}
          {currentScreen === "maps" && <Maps onBack={() => setCurrentScreen("learning")} userState={userState} />}
          {currentScreen === "reels" && <Reels />}
          {currentScreen === "chatbot" && <ChatBot onClose={() => setShowChatbot(false)} userType={userType} state={userState} region={userRegion} city={userCity} />}
          {currentScreen === "preparedness" && <PreparednessLevels />}
          {currentScreen === "admin" && (userType === "admin" || userType === "teacher") && (
            <AdminDashboard userType={userType} />
          )}
        </div>

        {/* Floating Chatbot Button */}
        <Button
          onClick={() => setShowChatbot(!showChatbot)}
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-primary hover:bg-primary-hover shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>

        {showChatbot && <ChatBot onClose={() => setShowChatbot(false)} userType={userType} state={userState} region={userRegion} city={userCity} />}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-card border-t border-border">
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