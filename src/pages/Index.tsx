import { useState, useEffect } from "react";
import { 
  AlertTriangle, Phone, Book, MapPin, Users, Shield, 
  Gamepad2, HelpCircle, FileText, Map, Play, BarChart3,
  GraduationCap, ChevronDown, RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
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
  const [showRoleModal, setShowRoleModal] = useState(false);
  const { toast } = useToast();

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

  const handleRoleSwitch = (newRole: UserType) => {
    setUserType(newRole);
    if (newRole === "admin") {
      setCurrentScreen("preparedness");
    } else {
      setCurrentScreen("home");
    }
    try {
      const saved = localStorage.getItem("sajag_user");
      const data = saved ? JSON.parse(saved) : {};
      data.userType = newRole;
      localStorage.setItem("sajag_user", JSON.stringify(data));
    } catch (e) {
      console.warn("Could not persist userType change", e);
    }
    setShowRoleModal(false);
    toast({
      title: `Switched to ${newRole.charAt(0).toUpperCase() + newRole.slice(1)} Mode!`,
      description: `Role navigation and specialized dashboard features are now active.`,
    });
  };

  const handleReOnboard = () => {
    setShowRoleModal(false);
    setIsOnboarded(false);
    setCurrentScreen("onboarding");
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
            <div className="flex items-center gap-1.5">
              {/* Role Switcher Pill */}
              <button
                type="button"
                onClick={() => setShowRoleModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/30 text-white transition-all shadow-sm border border-white/30"
                title="Switch role (Student / Teacher / Administrator)"
              >
                {userType === "student" && <GraduationCap className="w-3.5 h-3.5" />}
                {userType === "teacher" && <Users className="w-3.5 h-3.5" />}
                {userType === "admin" && <Shield className="w-3.5 h-3.5" />}
                <span className="capitalize">{userType}</span>
                <ChevronDown className="w-3 h-3 opacity-80" />
              </button>

              {/* State / Location Pill */}
              {userState && (
                <Badge 
                  variant="outline" 
                  className="bg-primary-foreground/15 text-primary-foreground text-xs border-primary-foreground/30 flex items-center gap-1 cursor-pointer hover:bg-primary-foreground/25"
                  onClick={() => setCurrentScreen("alerts")}
                >
                  <MapPin className="w-3 h-3" />
                  <span className="truncate max-w-[85px]">{userCity ? `${userCity}, ` : ""}{userState}</span>
                </Badge>
              )}
            </div>
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

        {/* Role Switcher Dialog */}
        <Dialog open={showRoleModal} onOpenChange={setShowRoleModal}>
          <DialogContent className="max-w-xs sm:max-w-sm rounded-2xl p-5">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Switch Account Role
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Select your role to access specialized views, navigation items, and dashboards.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2.5 py-2">
              {/* Student Role Card */}
              <div
                onClick={() => handleRoleSwitch("student")}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  userType === "student"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40 bg-card"
                }`}
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Student</h4>
                    {userType === "student" && (
                      <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4">Active</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Micro-learning video reels, interactive quizzes, gamified drills, emergency contacts, and risk maps.
                  </p>
                </div>
              </div>

              {/* Teacher Role Card */}
              <div
                onClick={() => handleRoleSwitch("teacher")}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  userType === "teacher"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40 bg-card"
                }`}
              >
                <div className="p-2 rounded-lg bg-accent/20 text-accent mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Teacher</h4>
                    {userType === "teacher" && (
                      <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4">Active</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Classroom safety dashboard, mock evacuation drill scheduling, student readiness monitoring, and hospital contacts.
                  </p>
                </div>
              </div>

              {/* Administrator Role Card */}
              <div
                onClick={() => handleRoleSwitch("admin")}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  userType === "admin"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40 bg-card"
                }`}
              >
                <div className="p-2 rounded-lg bg-alert-info/20 text-alert-info mt-0.5">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Administrator</h4>
                    {userType === "admin" && (
                      <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4">Active</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Multi-school preparedness levels, institutional safety compliance, district hazard analysis, and administrative oversight.
                  </p>
                </div>
              </div>
            </div>

            {/* Reset Onboarding Option */}
            <div className="pt-2 border-t border-border flex justify-between items-center">
              <button
                type="button"
                onClick={handleReOnboard}
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Re-run Onboarding Form
              </button>
              <Button size="sm" variant="outline" onClick={() => setShowRoleModal(false)} className="text-xs h-7">
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
