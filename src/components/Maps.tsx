import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Map, MapPin, AlertTriangle, Waves, Flame, Wind, 
  ChevronLeft, Info, Compass, ShieldCheck, History, Radio
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

interface MapsProps {
  onBack: () => void;
  userState?: string;
}

interface StateRiskProfile {
  seismicZone: string;
  seismicLevel: string;
  floodRisk: string;
  cycloneRisk: string;
  fireRisk: string;
  keyHazards: string[];
  safeZones: string[];
  evacuationProtocol: string;
  historicalEvent: string;
}

const STATE_RISK_MAP_DATA: Record<string, StateRiskProfile> = {
  "Uttar Pradesh": {
    seismicZone: "Zone IV (Northern / NCR / Terai) & Zone III",
    seismicLevel: "Moderate to High",
    floodRisk: "High (Ganga, Yamuna, Ghaghra, Sharda Basins)",
    cycloneRisk: "Low (Sub-tropical convective storms)",
    fireRisk: "Moderate (Summer crop residue & urban clusters)",
    keyHazards: [
      "Riverine flooding across Varanasi, Prayagraj, Ballia, and Gorakhpur",
      "Dense winter fog reducing expressway transit visibility below 30m",
      "Seismic vulnerability along Nepal border and NCR districts"
    ],
    safeZones: [
      "Elevated District Flood Relief Shelters (Prayagraj & Varanasi)",
      "Designated University and College Stadium grounds",
      "Pucca Government Inter Colleges (GIC) with concrete terraces"
    ],
    evacuationProtocol: "Follow designated elevated flood bunds (embankments). Avoid submerged river ghats and underpasses. Assemble at GIC ground.",
    historicalEvent: "1998 Gorakhpur floods affecting 3.5 million; and recurrent Ganga-Yamuna riverine floods reaching warning levels at Prayagraj/Varanasi."
  },
  "Punjab": {
    seismicZone: "Zone IV (Gurdaspur, Hoshiarpur, Rupnagar) & Zone III",
    seismicLevel: "Moderate to High",
    floodRisk: "High (Sutlej, Beas, Ravi & seasonal Choes)",
    cycloneRisk: "Negligible",
    fireRisk: "High (Post-harvest agricultural burning season)",
    keyHazards: [
      "Sutlej and Beas flash flooding during heavy dam release",
      "Sub-mountainous choes (torrents) in Hoshiarpur and Rupnagar",
      "Severe winter smog and visibility impairment"
    ],
    safeZones: [
      "Elevated school grounds and Gurudwara langar community centers",
      "Anandpur Sahib & Rupnagar high-terrace government buildings",
      "District sports complexes and high-ground grain storage yards"
    ],
    evacuationProtocol: "Move perpendicular to river flow toward elevated GT Road embankments. Do not drive through seasonal nullahs or inundated culverts.",
    historicalEvent: "1988 and 2023 Punjab flash floods inundating thousands of acres across Rupnagar, Patiala, and Ferozepur riverbanks."
  },
  "Delhi": {
    seismicZone: "Zone IV (High Damage Risk Zone)",
    seismicLevel: "High Risk",
    floodRisk: "Moderate to High (Yamuna River floodplains)",
    cycloneRisk: "Negligible",
    fireRisk: "High (High-density urban bazaars & electrical fires)",
    keyHazards: [
      "Yamuna floodplain inundation during Hathnikund barrage release",
      "Earthquake vulnerability due to unreinforced masonry structures",
      "Severe winter smog and air stagnation index"
    ],
    safeZones: [
      "Open district parks (India Gate lawns, Ramlila ground, Japanese Park)",
      "School playfields away from glass skyscrapers and high-tension wires",
      "Metro station elevated plaza areas (outdoor open concourses)"
    ],
    evacuationProtocol: "Drop, Cover, and Hold during tremors. Exit buildings via open staircases once shaking stops. Do not use lifts.",
    historicalEvent: "July 2023 Yamuna river surge to an all-time record 208.66 meters, inundating the Ring Road, Red Fort, and ITO."
  },
  "Maharashtra": {
    seismicZone: "Zone III & Zone IV (Koyna-Warna region)",
    seismicLevel: "Moderate to High",
    floodRisk: "High (Coastal urban flooding & Mithi River)",
    cycloneRisk: "High (Konkan Arabian Sea coastline)",
    fireRisk: "Moderate (Forest fires in Sahyadri during pre-monsoon)",
    keyHazards: [
      "Mumbai & Konkan coastal storm surge combined with high tides",
      "Western Ghats landslides along Pune-Mumbai and Konkan railway routes",
      "Drought and extreme heatwaves in Marathwada & Vidarbha"
    ],
    safeZones: [
      "BMC Multi-purpose Disaster Shelters and Municipal High Schools",
      "Shivaji Park, Azad Maidan, and large open university campuses",
      "Elevated railway station concourses and community hall terraces"
    ],
    evacuationProtocol: "Move inland away from sea face during high-tide warnings. Avoid low-lying underground subways and basement parking.",
    historicalEvent: "26 July 2005 Mumbai cloudburst (944mm in 24 hours); and 1993 Latur earthquake (magnitude 6.2)."
  }
};

const Maps = ({ onBack, userState = "Uttar Pradesh" }: MapsProps) => {
  const isPunjab = userState.trim().toLowerCase() === "punjab";
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const [activeHazardView, setActiveHazardView] = useState<string>("all");

  const stateData: StateRiskProfile = STATE_RISK_MAP_DATA[userState] || {
    seismicZone: "Zone III (Moderate Damage Risk)",
    seismicLevel: "Moderate",
    floodRisk: "Moderate (Local river catchments)",
    cycloneRisk: "Seasonal",
    fireRisk: "Moderate",
    keyHazards: [
      `Localized monsoon waterlogging across low-lying districts of ${userState}`,
      `Seismic shaking vulnerability in multi-story unreinforced structures`,
      `Seasonal weather extremes (intense summer heat and convective thunderstorms)`
    ],
    safeZones: [
      "District Government High School and College playgrounds",
      "Elevated municipal stadiums and community sports complexes",
      "Designated District Emergency Relief Centers"
    ],
    evacuationProtocol: "Familiarize yourself with primary and secondary building exit routes. Follow official district administration loudspeakers.",
    historicalEvent: `Historical regional monsoon and geological events recorded by IMD and state disaster management authority in ${userState}.`
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Map className="w-5 h-5 mr-2 text-primary" />
              Disaster Risk Map
            </h2>
            <p className="text-xs text-muted-foreground">
              Geographic vulnerability profile for <strong>{userState}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* If Punjab, embed the official interactive Punjab Disaster Map */}
      {isPunjab && (
        <Card className="overflow-hidden border-primary/30 shadow-sm">
          <CardHeader className="py-2.5 px-3.5 bg-muted/50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center">
                <Compass className="w-4 h-4 mr-1.5 text-primary" />
                Interactive Punjab Hazard GIS Layer
              </CardTitle>
              <Badge variant="outline" className="text-[10px] text-primary border-primary">
                Live Interactive Map
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <iframe
              title="Punjab Disaster Risk Map"
              src="/punjab_map.html"
              className="w-full h-[320px] border-none"
            ></iframe>
          </CardContent>
        </Card>
      )}

      {/* State Hazard Risk Card */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center">
              <MapPin className="w-4 h-4 mr-1.5 text-primary" />
              {userState} Vulnerability Index
            </CardTitle>
            <Badge variant="secondary" className="text-xs">NDMA Verified</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-alert-critical/10 border border-alert-critical/20">
              <p className="text-muted-foreground font-medium">Earthquake Seismic Zone</p>
              <p className="font-bold text-alert-critical text-sm mt-0.5">{stateData.seismicZone}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-alert-info/10 border border-alert-info/20">
              <p className="text-muted-foreground font-medium">Flood Vulnerability</p>
              <p className="font-bold text-alert-info text-sm mt-0.5">{stateData.floodRisk}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-alert-warning/10 border border-alert-warning/20">
              <p className="text-muted-foreground font-medium">Fire & Heat Risk</p>
              <p className="font-bold text-alert-warning text-sm mt-0.5">{stateData.fireRisk}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-muted-foreground font-medium">Cyclone & Wind Risk</p>
              <p className="font-bold text-primary text-sm mt-0.5">{stateData.cycloneRisk}</p>
            </div>
          </div>

          <div className="pt-1">
            <h4 className="font-semibold text-xs mb-1.5">Primary Regional Hazard Threats:</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {stateData.keyHazards.map((hazard, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-alert-critical font-bold">•</span>
                  <span>{hazard}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Map Categories */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Explore Hazard Overlays
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <Card 
            className="hover:shadow-md transition-all cursor-pointer border-border hover:border-primary/50"
            onClick={() => setSelectedModal("earthquake")}
          >
            <CardContent className="p-3 text-center">
              <div className="w-10 h-10 rounded-full bg-alert-critical/10 flex items-center justify-center mx-auto mb-2 text-alert-critical">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs">Seismic Zones</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Fault lines & soil class</p>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-md transition-all cursor-pointer border-border hover:border-primary/50"
            onClick={() => setSelectedModal("flood")}
          >
            <CardContent className="p-3 text-center">
              <div className="w-10 h-10 rounded-full bg-alert-info/10 flex items-center justify-center mx-auto mb-2 text-alert-info">
                <Waves className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs">Flood Basins</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">River catchments</p>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-md transition-all cursor-pointer border-border hover:border-primary/50"
            onClick={() => setSelectedModal("fire")}
          >
            <CardContent className="p-3 text-center">
              <div className="w-10 h-10 rounded-full bg-alert-warning/10 flex items-center justify-center mx-auto mb-2 text-alert-warning">
                <Flame className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs">Fire & Heat</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Vulnerability points</p>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-md transition-all cursor-pointer border-border hover:border-primary/50"
            onClick={() => setSelectedModal("cyclone")}
          >
            <CardContent className="p-3 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 text-primary">
                <Wind className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs">Wind & Storms</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Coastal & gale zones</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Emergency Spatial Tools */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Emergency Spatial Protocols
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-9 justify-start"
              onClick={() => setSelectedModal("safezones")}
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-alert-safe" />
              Safe Zones
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-9 justify-start"
              onClick={() => setSelectedModal("evacuation")}
            >
              <Compass className="w-3.5 h-3.5 mr-1.5 text-primary" />
              Evacuation Routes
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-9 justify-start"
              onClick={() => setSelectedModal("historical")}
            >
              <History className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
              Historical Disasters
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-9 justify-start"
              onClick={() => setSelectedModal("livefeed")}
            >
              <Radio className="w-3.5 h-3.5 mr-1.5 text-alert-critical animate-pulse" />
              Live Radar Info
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Detail Modal */}
      {selectedModal && (
        <Dialog open={!!selectedModal} onOpenChange={() => setSelectedModal(null)}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center">
                {selectedModal === "earthquake" && <AlertTriangle className="w-5 h-5 mr-2 text-alert-critical" />}
                {selectedModal === "flood" && <Waves className="w-5 h-5 mr-2 text-alert-info" />}
                {selectedModal === "fire" && <Flame className="w-5 h-5 mr-2 text-alert-warning" />}
                {selectedModal === "cyclone" && <Wind className="w-5 h-5 mr-2 text-primary" />}
                {selectedModal === "safezones" && <ShieldCheck className="w-5 h-5 mr-2 text-alert-safe" />}
                {selectedModal === "evacuation" && <Compass className="w-5 h-5 mr-2 text-primary" />}
                {selectedModal === "historical" && <History className="w-5 h-5 mr-2 text-amber-500" />}
                {selectedModal === "livefeed" && <Radio className="w-5 h-5 mr-2 text-alert-critical" />}
                
                {selectedModal === "earthquake" && `Seismic Hazard Map: ${userState}`}
                {selectedModal === "flood" && `Flood Basin Overlay: ${userState}`}
                {selectedModal === "fire" && `Fire & Heat Hazard: ${userState}`}
                {selectedModal === "cyclone" && `Wind & Cyclone Zone: ${userState}`}
                {selectedModal === "safezones" && `Identified Safe Assembly Grounds (${userState})`}
                {selectedModal === "evacuation" && `Standard Evacuation Routes (${userState})`}
                {selectedModal === "historical" && `Major Historical Events in ${userState}`}
                {selectedModal === "livefeed" && `IMD & CWC Radar Status`}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Official NDMA & Geological Survey of India geospatial safety data
              </DialogDescription>
            </DialogHeader>

            <div className="py-2 text-xs space-y-3">
              {selectedModal === "earthquake" && (
                <div className="space-y-2">
                  <p className="leading-relaxed">
                    <strong>Classification:</strong> {stateData.seismicZone}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Buildings in this zone must comply with Bureau of Indian Standards (BIS) IS 1893 seismic resistance standards.
                  </p>
                  <div className="bg-muted p-2.5 rounded border border-border">
                    <p className="font-semibold text-foreground mb-1">Key Action for Schools:</p>
                    <p>Anchor heavy lab apparatus and library shelves to structural walls. Designate open lawns away from glass windows as assembly zones.</p>
                  </div>
                </div>
              )}

              {selectedModal === "flood" && (
                <div className="space-y-2">
                  <p className="leading-relaxed">
                    <strong>Flood Hazard Rating:</strong> {stateData.floodRisk}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Low-lying riverine areas, old floodplains, and drainage bottlenecks are highlighted. Monitored in real-time by the Central Water Commission (CWC).
                  </p>
                  <div className="bg-muted p-2.5 rounded border border-border">
                    <p className="font-semibold text-foreground mb-1">Evacuation Tip:</p>
                    <p>Never walk or drive across flooded bridges or culverts. Keep drinking water and emergency kits on upper levels.</p>
                  </div>
                </div>
              )}

              {selectedModal === "safezones" && (
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">Verified Emergency Assembly Points in {userState}:</p>
                  <ul className="space-y-1.5 text-muted-foreground">
                    {stateData.safeZones.map((sz, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-alert-safe shrink-0 mt-0.5" />
                        <span>{sz}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedModal === "evacuation" && (
                <div className="space-y-2">
                  <p className="leading-relaxed">
                    <strong>Evacuation Protocol:</strong> {stateData.evacuationProtocol}
                  </p>
                  <div className="bg-primary/10 border border-primary/20 p-2.5 rounded text-primary">
                    <p className="font-semibold mb-0.5">School Protocol:</p>
                    <p>Teachers must account for each student via attendance rosters before relocating to municipal relief shelters.</p>
                  </div>
                </div>
              )}

              {selectedModal === "historical" && (
                <div className="space-y-2">
                  <p className="leading-relaxed">
                    <strong>Historical Disaster Benchmark:</strong>
                  </p>
                  <p className="p-2.5 bg-muted rounded border border-border leading-relaxed text-muted-foreground">
                    {stateData.historicalEvent}
                  </p>
                </div>
              )}

              {selectedModal === "livefeed" && (
                <div className="space-y-2">
                  <p className="leading-relaxed">
                    <strong>Radar & River Gauges:</strong> Connected to official India Meteorological Department Doppler radar and Central Water Commission telemetry stations for {userState}.
                  </p>
                  <div className="flex items-center space-x-2 p-2 bg-alert-safe/10 border border-alert-safe/30 rounded text-alert-safe font-medium">
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>Telemetry feeds status: OPERATIONAL</span>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button size="sm" className="w-full text-xs" onClick={() => setSelectedModal(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Maps;
