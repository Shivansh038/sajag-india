import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, FlaskConical, LifeBuoy, Wrench, MapPin, Clock, Shield, X, CheckCircle, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EducationalContent from "./EducationalContent";

type Disaster = "Floods" | "Cyclones" | "Tsunamis" | "Heat Wave" | "Earthquake" | "Fire";
type ModuleType = "Science of" | "Emergency Measures" | "Emergency Kits";
type EmergencySubtype = "Location" | "Timing" | "Dos and Don'ts";
type SubSubtype = "Indoors" | "Outdoors" | "Before" | "After" | "Trapped Under Debris" | "Dos and Don'ts";

interface ModulesProps {
  onBack: () => void;
  userId?: string;
}

const Modules = ({ onBack, userId = "local_user" }: ModulesProps) => {
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<EmergencySubtype | null>(null);
  const [selectedSubSubtype, setSelectedSubSubtype] = useState<SubSubtype | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sajag_completed_modules");
      if (saved) {
        setCompletedModules(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load completed modules", e);
    }
  }, []);

  // Define the disaster categories with icons
  const disasterCategories = [
    { name: "Floods", icon: "🌧️" },
    { name: "Cyclones", icon: "🌀" },
    { name: "Tsunamis", icon: "🌊" },
    { name: "Heat Wave", icon: "🥵" },
    { name: "Earthquake", icon: "🫨" },
    { name: "Fire", icon: "🔥" },
  ];

  // Define the content for each disaster module
  const contentData: Record<string, any> = {
    "Earthquake": {
      "Science of": { htmlFile: "/earthquake_science.html" },
      "Emergency Measures": {
        "Location": {
          "Indoors": { htmlFile: "/earthquake_indoors.html" },
          "Outdoors": { htmlFile: "/earthquake_outdoors.html" },
          "Trapped Under Debris": { htmlFile: "/earthquake_trapped.html" }
        },
        "Timing": {
          "Before": { htmlFile: "/earthquake_before.html" },
          "After": { htmlFile: "/earthquake_after.html" }
        },
        "Dos and Don'ts": { htmlFile: "/earthquake_dos.html" }
      },
      "Emergency Kits": { htmlFile: "/emergency_kit.html" }
    },
    "Floods": {
      "Science of": { htmlFile: "/flood_science.html" },
      "Emergency Measures": {
        "Location": {
          "Indoors": { htmlFile: "/flood_indoors.html" },
          "Outdoors": { htmlFile: "/flood_outdoors.html" },
        },
        "Timing": {
          "Before": { htmlFile: "/flood_before.html" },
          "After": { htmlFile: "/flood_after.html" }
        },
        "Dos and Don'ts": { htmlFile: "/flood_dos.html" }
      },
      "Emergency Kits": { htmlFile: "/emergency_kit.html" }
    },
    "Cyclones": {
      "Science of": { htmlFile: "/cyclone_science.html" },
      "Emergency Measures": {
        "Location": {
          "Indoors": { htmlFile: "/cyclone_indoors.html" },
          "Outdoors": { htmlFile: "/cyclone_outdoors.html" },
        },
        "Timing": {
          "Before": { htmlFile: "/cyclone_before.html" },
          "After": { htmlFile: "/cyclone_after.html" }
        },
        "Dos and Don'ts": { htmlFile: "/cyclone_dos.html" }
      },
      "Emergency Kits": { htmlFile: "/emergency_kit.html" }
    },
    "Tsunamis": {
      "Science of": { htmlFile: "/tsunami_science.html" },
      "Emergency Measures": {
        "Location": {
          "Indoors": { htmlFile: "/tsunami_indoor.html" },
          "Outdoors": { htmlFile: "/tsunami_outdoor.html" },
        },
        "Timing": {
          "Before": { htmlFile: "/tsunami_before.html" },
          "After": { htmlFile: "/tsunami_after.html" }
        },
        "Dos and Don'ts": { htmlFile: "/tsunami_dos.html" }
      },
      "Emergency Kits": { htmlFile: "/emergency_kit.html" }
    },
    "Heat Wave": {
      "Science of": { htmlFile: "/heatwave_science.html" },
      "Emergency Measures": {
        "Location": {
          "Indoors": { htmlFile: "/heatwave_indoors.html" },
          "Outdoors": { htmlFile: "/heatwave_outdoors.html" },
        },
        "Timing": {
          "Before": { htmlFile: "/heatwave_before.html" },
          "After": { htmlFile: "/heatwave_after.html" }
        },
        "Dos and Don'ts": { htmlFile: "/heatwave_dos.html" }
      },
      "Emergency Kits": { htmlFile: "/heatwave_kit.html" }
    },
    "Fire": {
      "Science of": { htmlFile: "/fire_science.html" },
      "Emergency Measures": {
        "Location": {
          "Indoors": { htmlFile: "/fire_indoors.html" },
          "Outdoors": { htmlFile: "/fire_outdoors.html" },
        },
        "Timing": {
          "Before": { htmlFile: "/fire_before.html" },
          "After": { htmlFile: "/fire_after.html" }
        },
        "Dos and Don'ts": { htmlFile: "/fire_dos.html" }
      },
      "Emergency Kits": { htmlFile: "/fire_kit.html" }
    },
  };

  const currentModuleId = `${selectedDisaster}-${selectedModule}-${selectedSubtype}-${selectedSubSubtype}`;
  const isModuleCompleted = completedModules.includes(currentModuleId);
  
  const handleMarkAsComplete = async () => {
    setIsMarkingComplete(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const updatedList = [...completedModules, currentModuleId];
      setCompletedModules(updatedList);
      
      try {
        localStorage.setItem("sajag_completed_modules", JSON.stringify(updatedList));

        // Update overall sajag_progress
        const prevProgressStr = localStorage.getItem("sajag_progress");
        const prev = prevProgressStr ? JSON.parse(prevProgressStr) : { progress: 0 };
        const moduleProgress = Math.min(100, updatedList.length * 20);
        const newProgress = Math.max(prev.progress || 0, moduleProgress);

        localStorage.setItem("sajag_progress", JSON.stringify({
          ...prev,
          progress: newProgress,
          lastModuleCompleted: currentModuleId
        }));
      } catch (e) {
        console.warn("Could not save completion to localStorage", e);
      }

      toast({
        title: "✅ Module Completed!",
        description: `Marked "${selectedDisaster} - ${selectedModule}" as completed. Safety preparedness updated!`,
      });
    } catch (error) {
      console.error("Failed to mark module as complete", error);
    } finally {
      setIsMarkingComplete(false);
    }
  };

  // Click handlers
  const handleDisasterClick = (disaster: Disaster) => {
    setSelectedDisaster(disaster);
    setSelectedModule(null);
    setSelectedSubtype(null);
    setSelectedSubSubtype(null);
  };

  const handleModuleClick = (module: ModuleType) => {
    setSelectedModule(module);
    setSelectedSubtype(null);
    setSelectedSubSubtype(null);

    // If the module has a direct HTML file (like Science of or Emergency Kits),
    // we set the subtype to trigger the content view immediately.
    if (contentData[selectedDisaster]?.[module]?.htmlFile) {
      setSelectedSubtype("Dos and Don'ts");
      setSelectedSubSubtype("Dos and Don'ts");
    }
  };
  
  const handleSubtypeClick = (subtype: EmergencySubtype) => {
    setSelectedSubtype(subtype);
    setSelectedSubSubtype(null);
    if (contentData[selectedDisaster]?.["Emergency Measures"]?.[subtype]?.htmlFile) {
      setSelectedSubSubtype("Dos and Don'ts");
    }
  };

  const handleSubSubtypeClick = (subSubtype: SubSubtype) => {
    setSelectedSubSubtype(subSubtype);
  };

  const handleBack = () => {
    if (selectedSubSubtype) {
      if (selectedModule === "Emergency Measures" && (selectedSubtype === "Location" || selectedSubtype === "Timing")) {
        setSelectedSubSubtype(null);
      } else {
        setSelectedSubSubtype(null);
        setSelectedSubtype(null);
      }
    } else if (selectedSubtype) {
      setSelectedSubtype(null);
    } else if (selectedModule) {
      setSelectedModule(null);
    } else if (selectedDisaster) {
      setSelectedDisaster(null);
    } else {
      onBack();
    }
  };

  const renderContent = () => {
    let content, title, htmlFile, videoUrl;

    if (selectedDisaster && selectedModule && selectedSubtype) {
      if (selectedModule === "Science of" || selectedModule === "Emergency Kits") {
        content = contentData[selectedDisaster]?.[selectedModule];
        title = `${selectedModule} ${selectedDisaster}`;
        htmlFile = content?.htmlFile;
        videoUrl = content?.video;
      } else if (selectedModule === "Emergency Measures" && selectedSubtype === "Dos and Don'ts") {
        content = contentData[selectedDisaster]?.["Emergency Measures"]?.["Dos and Don'ts"];
        title = `${selectedDisaster} - Dos and Don'ts`;
        htmlFile = content?.htmlFile;
        videoUrl = content?.video;
      } else if (selectedSubSubtype) {
        content = contentData[selectedDisaster]?.["Emergency Measures"]?.[selectedSubtype]?.[selectedSubSubtype];
        title = `${selectedDisaster} - ${selectedSubSubtype} (${selectedSubtype})`;
        htmlFile = content?.htmlFile;
        videoUrl = content?.video;
      }
    }

    if (htmlFile) {
      return (
        <div className="fixed inset-0 z-50 bg-background p-4 flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center pb-3 border-b mb-2">
            <div>
              <h2 className="text-lg font-bold">{title}</h2>
              <p className="text-xs text-muted-foreground">Official Safety & Survival Guide</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex-1 w-full bg-card rounded-md overflow-hidden border">
            <iframe
              title={title}
              src={htmlFile}
              className="w-full h-full border-none"
            ></iframe>
          </div>
          <div className="pt-3 flex justify-center">
            <Button
              onClick={handleMarkAsComplete}
              disabled={isMarkingComplete || isModuleCompleted}
              className="w-full max-w-sm"
              variant={isModuleCompleted ? "secondary" : "default"}
            >
              {isModuleCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Module Completed
                </>
              ) : isMarkingComplete ? (
                "Saving Progress..."
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Completed
                </>
              )}
            </Button>
          </div>
        </div>
      );
    } else if (content) {
      return (
        <EducationalContent
          title={title}
          text={content.text || "Content not found."}
          videoUrl={videoUrl}
          onBack={handleBack}
        />
      );
    }

    // Renders emergency measures subtypes
    if (selectedDisaster && selectedModule === "Emergency Measures" && !selectedSubtype) {
      return (
        <div className="p-4 space-y-4">
          <Button variant="outline" size="sm" onClick={handleBack} className="w-full text-wrap whitespace-normal">
            <ChevronLeft className="w-4 h-4 mr-2" /> Back to Modules
          </Button>
          <Card className="text-center shadow-sm">
            <CardHeader>
              <CardTitle>Emergency Measures for {selectedDisaster}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button onClick={() => handleSubtypeClick("Location")} size="lg" className="text-wrap whitespace-normal font-bold w-full">
                <MapPin className="w-4 h-4 mr-2" /> Location (Indoors / Outdoors)
              </Button>
              <Button onClick={() => handleSubtypeClick("Timing")} size="lg" className="text-wrap whitespace-normal font-bold w-full">
                <Clock className="w-4 h-4 mr-2" /> Timing (Before / After)
              </Button>
              <Button onClick={() => handleSubtypeClick("Dos and Don'ts")} size="lg" className="text-wrap whitespace-normal font-bold w-full">
                <Shield className="w-4 h-4 mr-2" /> Official Dos and Don'ts
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Renders location subtypes for emergency measures
    if (selectedDisaster && selectedModule === "Emergency Measures" && selectedSubtype === "Location") {
      return (
        <div className="p-4 space-y-4">
          <Button variant="outline" size="sm" onClick={handleBack} className="w-full text-wrap whitespace-normal">
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Card className="text-center shadow-sm">
            <CardHeader>
              <CardTitle>Location - {selectedDisaster}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button onClick={() => handleSubSubtypeClick("Indoors")} size="lg" className="text-wrap whitespace-normal font-bold w-full">
                Indoors Survival Strategy
              </Button>
              <Button onClick={() => handleSubSubtypeClick("Outdoors")} size="lg" className="text-wrap whitespace-normal font-bold w-full">
                Outdoors Survival Strategy
              </Button>
              {selectedDisaster === "Earthquake" && (
                <Button onClick={() => handleSubSubtypeClick("Trapped Under Debris")} size="lg" className="text-wrap whitespace-normal font-bold w-full">
                  Trapped Under Debris Action
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    // Renders timing subtypes for emergency measures
    if (selectedDisaster && selectedModule === "Emergency Measures" && selectedSubtype === "Timing") {
      return (
        <div className="p-4 space-y-4">
          <Button variant="outline" size="sm" onClick={handleBack} className="w-full text-wrap whitespace-normal">
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Card className="text-center shadow-sm">
            <CardHeader>
              <CardTitle>Timing - {selectedDisaster}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button onClick={() => handleSubSubtypeClick("Before")} size="lg" className="text-wrap whitespace-normal font-bold w-full">
                Before Disaster Strikes (Preparation)
              </Button>
              <Button onClick={() => handleSubSubtypeClick("After")} size="lg" className="text-wrap whitespace-normal font-bold w-full">
                After Disaster (Recovery & Safety)
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Renders the module selection view
    if (selectedDisaster) {
      return (
        <div className="p-4 space-y-4">
          <Button variant="outline" size="sm" onClick={handleBack} className="w-full text-wrap whitespace-normal">
            <ChevronLeft className="w-4 h-4 mr-2" /> Back to Disaster Types
          </Button>
          <Card className="text-center shadow-sm">
            <CardHeader>
              <CardTitle>Learning Modules for {selectedDisaster}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button onClick={() => handleModuleClick("Science of")} size="lg" className="text-wrap whitespace-normal font-bold w-full">
                <FlaskConical className="w-4 h-4 mr-2" />
                Science of {selectedDisaster}
              </Button>
              <Button onClick={() => handleModuleClick("Emergency Measures")} size="lg" className="text-wrap whitespace-normal font-bold w-full">
                <LifeBuoy className="w-4 h-4 mr-2" />
                Emergency Measures
              </Button>
              <Button onClick={() => handleModuleClick("Emergency Kits")} size="lg" className="text-wrap whitespace-normal font-bold w-full">
                <Wrench className="w-4 h-4 mr-2" />
                Emergency Survival Kits
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Renders the disaster selection view
    return (
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold flex items-center">
          <ChevronLeft className="w-5 h-5 mr-2 text-primary cursor-pointer" onClick={onBack} />
          Disaster Modules
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose a disaster to learn survival and preparedness protocols
        </p>
        <div className="grid grid-cols-2 gap-4">
          {disasterCategories.map((disaster) => (
            <Card 
              key={disaster.name}
              className="hover:shadow-md transition-all cursor-pointer hover:border-primary/50" 
              onClick={() => handleDisasterClick(disaster.name as Disaster)}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3 overflow-hidden">
                  <span role="img" aria-label={`${disaster.name} icon`} className="text-3xl">
                    {disaster.icon}
                  </span>
                </div>
                <h3 className="font-semibold text-sm">{disaster.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return <div className="p-2">{renderContent()}</div>;
};

export default Modules;
