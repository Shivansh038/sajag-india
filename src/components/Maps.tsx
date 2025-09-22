import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, MapPin, AlertTriangle, Waves, Flame, Wind, ChevronLeft } from "lucide-react";

interface MapsProps {
  onBack: () => void;
  userState: string;
}

const Maps = ({ onBack, userState }: MapsProps) => {
  const isPunjab = userState === "Punjab";
  
  if (isPunjab) {
    return (
      <div className="p-4 space-y-4">
        <Button variant="outline" size="sm" onClick={onBack} className="w-full text-wrap whitespace-normal">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Disaster Risk Map for Punjab</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Here, a local HTML file would be served. Since it's a file, we'll embed it directly. */}
            <iframe
              title="Punjab Disaster Map"
              src="punjab_map.html" // You would need to create this file
              className="w-full aspect-video border-none"
            ></iframe>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-bold flex items-center">
          <Map className="w-5 h-5 mr-2 text-primary" />
          Disaster Risk Maps
        </h2>
      </div>

      <p className="text-sm text-muted-foreground">
        Learn about disasters in your state and region
      </p>

      {/* Map Categories */}
      <div className="space-y-3">
        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-alert-critical rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Earthquake Risk Zones</h3>
                <p className="text-sm text-muted-foreground">
                  Seismic activity and earthquake prone areas
                </p>
              </div>
              <Badge variant="destructive" className="text-xs">High Risk</Badge>
            </div>
            <Button size="sm" className="w-full">
              <MapPin className="w-4 h-4 mr-1" />
              View Map
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-alert-info rounded-lg flex items-center justify-center">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Flood Prone Areas</h3>
                <p className="text-sm text-muted-foreground">
                  River basins and flood susceptible regions
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">Medium Risk</Badge>
            </div>
            <Button size="sm" className="w-full">
              <MapPin className="w-4 h-4 mr-1" />
              View Map
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-alert-warning rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Forest Fire Zones</h3>
                <p className="text-sm text-muted-foreground">
                  Areas vulnerable to forest and wildfire
                </p>
              </div>
              <Badge variant="outline" className="text-xs">Seasonal</Badge>
            </div>
            <Button size="sm" className="w-full">
              <MapPin className="w-4 h-4 mr-1" />
              View Map
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Wind className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Cyclone Impact Zones</h3>
                <p className="text-sm text-muted-foreground">
                  Coastal areas affected by cyclones
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">Coastal</Badge>
            </div>
            <Button size="sm" className="w-full">
              <MapPin className="w-4 h-4 mr-1" />
              View Map
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Location Risks */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            Your Area Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-alert-critical" />
                <span className="text-sm">Earthquake Risk</span>
              </div>
              <Badge variant="destructive" className="text-xs">Zone IV</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-2">
                <Waves className="w-4 h-4 text-alert-info" />
                <span className="text-sm">Flood Risk</span>
              </div>
              <Badge variant="secondary" className="text-xs">Moderate</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-alert-warning" />
                <span className="text-sm">Fire Risk</span>
              </div>
              <Badge variant="outline" className="text-xs">Low</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Features */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Map Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline">
              Historical Data
            </Button>
            <Button size="sm" variant="outline">
              Live Updates
            </Button>
            <Button size="sm" variant="outline">
              Evacuation Routes
            </Button>
            <Button size="sm" variant="outline">
              Safe Zones
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Maps;