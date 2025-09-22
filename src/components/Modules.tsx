import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, FlaskConical, LifeBuoy, Wrench, MapPin, Clock, Shield, X, CheckCircle } from "lucide-react";
import EducationalContent from "./EducationalContent";

type Disaster = "Floods" | "Cyclones" | "Tsunamis" | "Heat Wave" | "Earthquake" | "Fire";
type ModuleType = "Science of" | "Emergency Measures" | "Emergency Kits";
type EmergencySubtype = "Location" | "Timing" | "Dos and Don'ts";
type SubSubtype = "Indoors" | "Outdoors" | "Before" | "After" | "Trapped Under Debris" | "Dos and Don'ts";

interface ModulesProps {
  onBack: () => void;
  userId: string;
}

const Modules = ({ onBack, userId }: ModulesProps) => {
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<EmergencySubtype | null>(null);
  const [selectedSubSubtype, setSelectedSubSubtype] = useState<SubSubtype | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

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
  const contentData = {
    "Earthquake": {
      "Science of": { htmlFile: "/earthquake_science.html" },
      "Emergency Measures": {
        "Location": {
          "Indoors": { htmlFile: "/earthquake_indoors.html" },
          "Outdoors": { htmlFile: "/earthquake_outdoors.html" },
          "Trapped Under Debris":{ htmlFile: "/earthquake_trapped.html" }
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
      // Simulate API call to mark module as complete
      // In the real implementation, this would be an API call to a backend endpoint
      console.log(`Marking module "${currentModuleId}" as completed for user "${userId}"`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      setCompletedModules([...completedModules, currentModuleId]);
      console.log("Module marked as completed!");
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
    // Determine which content to render based on the current state.
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
        <div className="fixed inset-0 z-50 bg-background p-4 space-y-4 overflow-auto">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold">{title}</h2>
             <Button variant="ghost" size="icon" onClick={handleBack}>
                <X className="w-5 h-5" />
              </Button>
          </div>
          <iframe
            title={title}
            src={htmlFile}
            className="w-full h-full border-none"
          ></iframe>
           <div className="mt-4 flex justify-center">
            <Button
              onClick={handleMarkAsComplete}
              disabled={isMarkingComplete || isModuleCompleted}
              className="w-full max-w-sm"
            >
              {isModuleCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : isMarkingComplete ? (
                "Marking..."
              ) : (
                "Mark as completed"
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

    // Renders emergency measures subtypes.
    if (selectedDisaster && selectedModule === "Emergency Measures" && !selectedSubtype) {
      return (
        <div className="p-4 space-y-4">
          <Button variant="outline" size="sm" onClick={handleBack} className="w-full text-wrap whitespace-normal">
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Card className="text-center">
            <CardHeader>
              <CardTitle>Emergency Measures for {selectedDisaster}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button onClick={() => handleSubtypeClick("Location")} size="lg" className="text-wrap whitespace-normal font-bold w-full">
                <MapPin className="w-4 h-4 mr-2" /> Location
              </Button>
              <Button onClick={() => handleSubtypeClick("Timing")} size="lg" className="text-wrap whitespace-normal font-bold w-full">
                <Clock className="w-4 h-4 mr-2" /> Timing
              </Button>
              <Button onClick={() => handleSubtypeClick("Dos and Don'ts")} size="lg" className="text-wrap whitespace-normal font-bold w-full">
                <Shield className="w-4 h-4 mr-2" /> Dos and Don'ts
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
          <Card className="text-center">
            <CardHeader>
              <CardTitle>Location - {selectedDisaster}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Conditional rendering for Trapped Under Debris button */}
              <Button onClick={() => handleSubSubtypeClick("Indoors")} size="lg" className="text-wrap whitespace-normal font-bold w-full">Indoors</Button>
              <Button onClick={() => handleSubSubtypeClick("Outdoors")} size="lg" className="text-wrap whitespace-normal font-bold w-full">Outdoors</Button>
              {selectedDisaster === "Earthquake" && (
                <Button onClick={() => handleSubSubtypeClick("Trapped Under Debris")} size="lg" className="text-wrap whitespace-normal font-bold w-full">Trapped Under Debris</Button>
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
          <Card className="text-center">
            <CardHeader>
              <CardTitle>Timing - {selectedDisaster}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button onClick={() => handleSubSubtypeClick("Before")} size="lg" className="text-wrap whitespace-normal font-bold w-full">Before</Button>
              <Button onClick={() => handleSubSubtypeClick("After")} size="lg" className="text-wrap whitespace-normal font-bold w-full">After</Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Renders the module selection view.
    if (selectedDisaster) {
      return (
        <div className="p-4 space-y-4">
          <Button variant="outline" size="sm" onClick={handleBack} className="w-full text-wrap whitespace-normal">
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Card className="text-center">
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
                Emergency Kits
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Renders the disaster selection view.
    return (
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold flex items-center">
          <ChevronLeft className="w-5 h-5 mr-2 text-primary cursor-pointer" onClick={onBack} />
          Disaster Modules
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose a disaster to learn more about
        </p>
        <div className="grid grid-cols-2 gap-4">
          {disasterCategories.map((disaster) => (
            <Card 
              key={disaster.name}
              className="hover:shadow-md transition-all cursor-pointer" 
              onClick={() => handleDisasterClick(disaster.name as Disaster)}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3 overflow-hidden">
                  <span role="img" aria-label={`${disaster.name} icon`} className="text-3xl">
                    {disaster.icon}
                  </span>
                </div>
                <h3 className="font-semibold">{disaster.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return <div className="p-4">{renderContent()}</div>;
};

export default Modules;