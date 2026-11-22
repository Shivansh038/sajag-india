import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Book, Gamepad2, HelpCircle, FileText, Map
} from "lucide-react";
import Modules from "./Modules";
import Games from "./Games";
import Quizzes from "./Quizzes";
import Maps from "./Maps";

interface LearningModulesProps {
  userType: "student" | "teacher" | "admin";
  userState: string;
}

const LearningModules = ({ userType, userState }: LearningModulesProps) => {
  const [currentView, setCurrentView] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    setCurrentView(option);
  };

  const handleBackToMenu = () => {
    setCurrentView(null);
  };
  
  if (currentView === "maps") {
    return <Maps onBack={handleBackToMenu} userState={userState} />;
  }

  if (currentView === "modules") {
    return <Modules onBack={handleBackToMenu} />;
  }

  if (currentView === "games") {
    return <Games onBack={handleBackToMenu} />;
  }

  if (currentView === "quizzes") {
    return <Quizzes onBack={handleBackToMenu} />;
  }

  // Default view: Learning Options Grid
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold flex items-center">
          <Book className="w-5 h-5 mr-2 text-primary" />
          Learning Options
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose how you want to learn disaster preparedness
        </p>
      </div>

      {/* Learning Options Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card
          className="hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
          onClick={() => handleOptionClick("games")}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-3">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1 text-sm">Games</h3>
            <p className="text-xs text-muted-foreground">Interactive safety games</p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
          onClick={() => handleOptionClick("quizzes")}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-achievement rounded-lg flex items-center justify-center mx-auto mb-3">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1 text-sm">Quizzes</h3>
            <p className="text-xs text-muted-foreground">Test your knowledge</p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
          onClick={() => handleOptionClick("modules")}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-alert-info rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1 text-sm">Modules</h3>
            <p className="text-xs text-muted-foreground">Disaster action guides</p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
          onClick={() => handleOptionClick("maps")}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-alert-warning rounded-lg flex items-center justify-center mx-auto mb-3">
              <Map className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1 text-sm">Risk Maps</h3>
            <p className="text-xs text-muted-foreground">State hazard zones</p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Safety Readiness Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Active State Hazard Focus:</span>
              <span className="font-bold text-primary">{userState || "Uttar Pradesh"}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Curriculum Coverage:</span>
              <span className="font-semibold">6 Disasters (Earthquake, Flood, Cyclone, Fire, Heatwave, Tsunami)</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Complete quizzes and module guides to reach 100% preparedness
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningModules;
