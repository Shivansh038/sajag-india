import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Book, Gamepad2, HelpCircle, FileText, Map, ChevronLeft
} from "lucide-react";
import Modules from "./Modules";
import Games from "./Games";
import Quizzes from "./Quizzes";

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
    const isPunjab = userState.trim().toLowerCase() === "punjab";
    return (
      <div className="p-4 space-y-4">
        <Button variant="outline" size="sm" onClick={handleBackToMenu} className="w-full text-wrap whitespace-normal">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Disaster Risk Map for {userState}</CardTitle>
          </CardHeader>
          <CardContent>
            {isPunjab ? (
              <iframe
                title="Punjab Disaster Map"
                src="/punjab_map.html"
                className="w-full h-[500px] border-none" // Modified height here
              ></iframe>
            ) : (
              <p className="text-center text-muted-foreground">Map content for {userState} is not available yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
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
          className="hover:shadow-md transition-all cursor-pointer"
          onClick={() => handleOptionClick("games")}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-3">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Games</h3>
            <p className="text-xs text-muted-foreground">Interactive learning games</p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-all cursor-pointer"
          onClick={() => handleOptionClick("quizzes")}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-achievement rounded-lg flex items-center justify-center mx-auto mb-3">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Quizzes</h3>
            <p className="text-xs text-muted-foreground">Test your knowledge</p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-all cursor-pointer"
          onClick={() => handleOptionClick("modules")}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-alert-info rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Modules</h3>
            <p className="text-xs text-muted-foreground">Text and video lessons</p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-all cursor-pointer"
          onClick={() => handleOptionClick("maps")}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-alert-warning rounded-lg flex items-center justify-center mx-auto mb-3">
              <Map className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Maps</h3>
            <p className="text-xs text-muted-foreground">Disaster risk zones</p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Your Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            
            <div className="flex justify-between text-sm">
              <span>Modules Finished</span>
              <span className="font-medium">2</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-3">
              <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Overall Learning Progress: 65%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningModules;