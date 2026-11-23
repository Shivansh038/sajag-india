import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Map, MapPin, AlertTriangle, Waves, Flame, Wind, 
  ChevronLeft, Info, Compass, ShieldCheck, History, Radio,
  Layers, Eye, Navigation, CheckCircle2, Building, Phone
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

interface Hotspot {
  id: string;
  name: string;
  type: "safe_zone" | "hazard_zone" | "evacuation_point";
  x: number; // percentage in SVG
  y: number;
  label: string;
  details: string;
}

interface StateRiskProfile {
  seismicZone: string;
  seismicLevel: string;
  floodRisk: string;
  cycloneRisk: string;
  fireRisk: string;
  overallScore: number; // 1-100
  keyHazards: string[];
  safeZones: string[];
  evacuationProtocol: string;
  historicalEvent: string;
  hotspots: Hotspot[];
}

const STATE_RISK_MAP_DATA: Record<string, StateRiskProfile> = {
  "Uttar Pradesh": {
    seismicZone: "Zone IV (Northern / NCR / Terai) & Zone III",
    seismicLevel: "Moderate to High",
    floodRisk: "High (Ganga, Yamuna, Ghaghra, Sharda Basins)",
    cycloneRisk: "Low (Convective Thunderstorms)",
    fireRisk: "Moderate (Crop residue & urban fire risk)",
    overallScore: 78,
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
    historicalEvent: "1998 Gorakhpur floods affecting 3.5 million; recurrent Ganga-Yamuna riverine floods reaching red alert levels at Prayagraj and Varanasi.",
    hotspots: [
      { id: "up1", name: "Prayagraj Sangam Bund", type: "hazard_zone", x: 62, y: 64, label: "Flood Inundation Zone", details: "Confluence flood risk during monsoon releases from Tehri and Chambal." },
      { id: "up2", name: "GIC Inter College Ground", type: "safe_zone", x: 55, y: 52, label: "Designated Safe Shelter", details: "Capacity: 1,500 students. Reinforced concrete structure with backup power." },
      { id: "up3", name: "Noida NCR Fault Zone", type: "hazard_zone", x: 28, y: 35, label: "Seismic Zone IV", details: "High-density multi-story residential towers vulnerable to Himalayan tremors." },
      { id: "up4", name: "Gorakhpur Relief Hub", type: "evacuation_point", x: 75, y: 48, label: "District Evacuation Center", details: "NDRF 11th Battalion staging area with inflatable boats and rescue kits." }
    ]
  },
  "Punjab": {
    seismicZone: "Zone IV (Gurdaspur, Hoshiarpur, Rupnagar) & Zone III",
    seismicLevel: "Moderate to High",
    floodRisk: "High (Sutlej, Beas, Ravi & seasonal Choes)",
    cycloneRisk: "Negligible",
    fireRisk: "High (Agricultural residue season)",
    overallScore: 74,
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
    historicalEvent: "1988 and 2023 Punjab flash floods inundating thousands of acres across Rupnagar, Patiala, and Ferozepur riverbanks.",
    hotspots: [
      { id: "pb1", name: "Sutlej River Basin (Rupnagar)", type: "hazard_zone", x: 48, y: 45, label: "Flash Flood Warning Basin", details: "Heavy discharge from Bhakra Nangal Dam causes rapid inundation." },
      { id: "pb2", name: "Anandpur Safe Elevation Complex", type: "safe_zone", x: 58, y: 38, label: "High-Ground Assembly Point", details: "Elevated community complex equipped with community kitchen and emergency medical supplies." },
      { id: "pb3", name: "Hoshiarpur Shivalik Foothills", type: "hazard_zone", x: 52, y: 30, label: "Choe (Seasonal Torrent) Risk", details: "Rapid flash runoff down Shivalik hill streams cutting rural road links." }
    ]
  },
  "Delhi": {
    seismicZone: "Zone IV (High Damage Risk Zone)",
    seismicLevel: "High Risk",
    floodRisk: "Moderate to High (Yamuna River floodplains)",
    cycloneRisk: "Negligible",
    fireRisk: "High (High-density urban bazaars & electrical fires)",
    overallScore: 82,
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
    historicalEvent: "July 2023 Yamuna river surge to an all-time record 208.66 meters, inundating the Ring Road, Red Fort, and ITO.",
    hotspots: [
      { id: "dl1", name: "Yamuna Floodplain (ITO / Ring Road)", type: "hazard_zone", x: 65, y: 55, label: "Flood Risk Zone", details: "Submerged during 2023 flood. Inundation buffer for Yamuna riverbed." },
      { id: "dl2", name: "Ramlila Maidan Open Assembly", type: "safe_zone", x: 50, y: 48, label: "Mass Safe Assembly Zone", details: "Massive open grounds away from structural collapse hazards and power lines." },
      { id: "dl3", name: "Old Delhi Dense Cluster", type: "hazard_zone", x: 52, y: 42, label: "High Fire & Seismic Risk", details: "Narrow lanes with overhead wires and aging unreinforced masonry structures." }
    ]
  },
  "Maharashtra": {
    seismicZone: "Zone III & Zone IV (Koyna-Warna region)",
    seismicLevel: "Moderate to High",
    floodRisk: "High (Coastal urban flooding & Mithi River)",
    cycloneRisk: "High (Konkan Arabian Sea coastline)",
    fireRisk: "Moderate (Forest fires in Sahyadri during pre-monsoon)",
    overallScore: 80,
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
    historicalEvent: "26 July 2005 Mumbai cloudburst (944mm in 24 hours); and 1993 Latur earthquake (magnitude 6.2).",
    hotspots: [
      { id: "mh1", name: "Mithi River Catchment", type: "hazard_zone", x: 30, y: 65, label: "Urban Flood Chokepoint", details: "High inundation during monsoon high tides across Kurla, Kalina, and BKC." },
      { id: "mh2", name: "Shivaji Park Open Ground", type: "safe_zone", x: 28, y: 58, label: "Central Assembly Ground", details: "Extensive open grounds suitable for emergency helicopter landings and mass assembly." },
      { id: "mh3", name: "Khandala Ghat Landslide Zone", type: "hazard_zone", x: 42, y: 60, label: "Landslide Risk Zone", details: "Steep rock cuttings prone to debris fall during torrential downpours." }
    ]
  },
  "Uttarakhand": {
    seismicZone: "Zone V & Zone IV (Severe Tectonic Belt)",
    seismicLevel: "Very High (Himalayan Main Central Thrust)",
    floodRisk: "Severe (Flash floods, GLOF & Cloudbursts)",
    cycloneRisk: "Negligible",
    fireRisk: "High (Chir Pine forest fires during May-June)",
    overallScore: 88,
    keyHazards: [
      "Glacial lake outburst floods (GLOF) and sudden cloudburst torrents",
      "Seismic vulnerability along the Himalayan Central Thrust belt",
      "Frequent monsoon landslides blocking Char Dham pilgrim highways"
    ],
    safeZones: [
      "District Police Lines and Army Cantonment Helipads",
      "Concrete Inter College multi-story buildings above river levels",
      "Tehri Dam township high-altitude community centers"
    ],
    evacuationProtocol: "Head uphill immediately away from river canyons and landslide scarps. Never take shelter under overhanging rock cliffs.",
    historicalEvent: "2013 Kedarnath disaster; 2021 Chamoli flash flood disaster triggered by rock/ice avalanche.",
    hotspots: [
      { id: "uk1", name: "Alaknanda / Mandakini Valleys", type: "hazard_zone", x: 45, y: 50, label: "GLOF & Flash Flood Corridor", details: "Steep river gorges with extreme water velocity during cloudbursts." },
      { id: "uk2", name: "Dehradun Cantonment Grounds", type: "safe_zone", x: 35, y: 40, label: "Disaster Logistics Hub", details: "NDRF and SDRF operational center with dedicated air evacuation facilities." }
    ]
  },
  "Odisha": {
    seismicZone: "Zone III & Zone II",
    seismicLevel: "Low to Moderate",
    floodRisk: "High (Mahanadi, Brahmani, Baitarani Basins)",
    cycloneRisk: "Severe (Bay of Bengal Super Cyclone Corridor)",
    fireRisk: "Moderate",
    overallScore: 85,
    keyHazards: [
      "Category 4/5 Tropical Cyclones with 200+ km/h sustained wind speeds",
      "Coastal storm surges penetrating up to 10-15 km inland",
      "Severe flooding in Mahanadi river delta districts"
    ],
    safeZones: [
      "800+ Multipurpose Cyclone Shelters (ODRRAF & Red Cross)",
      "Concrete High Schools built on elevated stilts",
      "District Collectorate hardened disaster centers"
    ],
    evacuationProtocol: "Evacuate early via designated evacuation buses to nearest pucca Cyclone Shelter. Secure livestock in community animal shelters.",
    historicalEvent: "1999 Odisha Super Cyclone (wind speeds 260 km/h); Cyclone Fani (2019) with successful zero-casualty mass evacuation of 1.2 million citizens.",
    hotspots: [
      { id: "od1", name: "Puri Coastal Surge Line", type: "hazard_zone", x: 70, y: 65, label: "Severe Cyclone Landing Zone", details: "Direct exposure to Bay of Bengal cyclonic landfalls." },
      { id: "od2", name: "Multipurpose Cyclone Shelter #14", type: "safe_zone", x: 62, y: 58, label: "Engineered Storm Shelter", details: "Built to withstand 250 km/h winds and elevated 4 meters above ground storm surges." }
    ]
  }
};

const ALL_STATES = Object.keys(STATE_RISK_MAP_DATA);

const Maps = ({ onBack, userState = "Uttar Pradesh" }: MapsProps) => {
  const [selectedState, setSelectedState] = useState<string>(
    STATE_RISK_MAP_DATA[userState] ? userState : "Uttar Pradesh"
  );
  const [activeHazardFilter, setActiveHazardFilter] = useState<"all" | "seismic" | "flood" | "cyclone" | "fire">("all");
  const [mapMode, setMapMode] = useState<"gis" | "national" | "punjab_dashboard">("gis");
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const stateData = useMemo(() => {
    return STATE_RISK_MAP_DATA[selectedState] || STATE_RISK_MAP_DATA["Uttar Pradesh"];
  }, [selectedState]);

  const isPunjab = selectedState === "Punjab";

  return (
    <div className="p-3.5 space-y-3.5 select-none pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-lg font-bold flex items-center">
              <Map className="w-5 h-5 mr-1.5 text-primary" />
              Disaster Risk Maps
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Geographic vulnerability & safe zones
            </p>
          </div>
        </div>

        {/* State Quick Selector */}
        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setActiveHotspot(null);
          }}
          className="text-xs font-semibold bg-card border border-border rounded-lg px-2.5 py-1.5 text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {ALL_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Map Mode Selector Tabs */}
      <div className="bg-muted p-1 rounded-xl flex items-center text-xs font-bold gap-1">
        <button
          onClick={() => setMapMode("gis")}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mapMode === "gis" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-primary" />
          <span>{selectedState} GIS</span>
        </button>

        <button
          onClick={() => setMapMode("national")}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mapMode === "national" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-amber-500" />
          <span>India Multi-Hazard</span>
        </button>

        {isPunjab && (
          <button
            onClick={() => setMapMode("punjab_dashboard")}
            className={`py-1.5 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
              mapMode === "punjab_dashboard" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Live Layer</span>
          </button>
        )}
      </div>

      {/* Hazard Layer Filter Pills */}
      {mapMode !== "punjab_dashboard" && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
          <button
            onClick={() => setActiveHazardFilter("all")}
            className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all border ${
              activeHazardFilter === "all" 
                ? "bg-foreground text-background border-foreground shadow-sm" 
                : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
            }`}
          >
            All Hazards
          </button>
          <button
            onClick={() => setActiveHazardFilter("seismic")}
            className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all border flex items-center gap-1 ${
              activeHazardFilter === "seismic" 
                ? "bg-alert-critical text-white border-alert-critical shadow-sm" 
                : "bg-alert-critical/10 text-alert-critical border-alert-critical/20"
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Seismic Faults</span>
          </button>
          <button
            onClick={() => setActiveHazardFilter("flood")}
            className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all border flex items-center gap-1 ${
              activeHazardFilter === "flood" 
                ? "bg-alert-info text-white border-alert-info shadow-sm" 
                : "bg-alert-info/10 text-alert-info border-alert-info/20"
            }`}
          >
            <Waves className="w-3 h-3" />
            <span>River Basins</span>
          </button>
          <button
            onClick={() => setActiveHazardFilter("cyclone")}
            className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all border flex items-center gap-1 ${
              activeHazardFilter === "cyclone" 
                ? "bg-purple-600 text-white border-purple-600 shadow-sm" 
                : "bg-purple-500/10 text-purple-400 border-purple-500/20"
            }`}
          >
            <Wind className="w-3 h-3" />
            <span>Cyclone Coast</span>
          </button>
          <button
            onClick={() => setActiveHazardFilter("fire")}
            className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all border flex items-center gap-1 ${
              activeHazardFilter === "fire" 
                ? "bg-alert-warning text-white border-alert-warning shadow-sm" 
                : "bg-alert-warning/10 text-alert-warning border-alert-warning/20"
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Heat & Fire</span>
          </button>
        </div>
      )}

      {/* Main Interactive Map Canvas */}
      {mapMode === "punjab_dashboard" && isPunjab ? (
        <Card className="overflow-hidden border-primary/30 shadow-md">
          <CardHeader className="py-2.5 px-3 bg-muted/60 border-b">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-primary" />
                Punjab State Disaster Management GIS
              </span>
              <Badge variant="outline" className="text-[10px] text-primary border-primary">
                Live Interactive Telemetry
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <iframe
              title="Punjab Disaster Risk Map"
              src="/punjab_map.html"
              className="w-full h-[340px] border-none"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="w-full h-[280px] bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-800 shadow-xl flex items-center justify-center">
          {/* Animated Map Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b22_1px,transparent_1px),linear-gradient(to_bottom,#1e293b22_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* SVG Map Graphics */}
          {mapMode === "national" ? (
            /* National India Hazard Overview */
            <svg viewBox="0 0 400 300" className="w-full h-full p-2">
              <defs>
                <linearGradient id="seismicBelt" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="floodBasinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="cycloneCoastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Simplified India Territorial Outline */}
              <path
                d="M 180,40 L 210,48 L 240,65 L 230,95 L 260,110 L 300,105 L 325,120 L 300,135 L 260,130 L 240,145 L 255,175 L 240,210 L 205,270 L 195,270 L 170,225 L 140,175 L 120,150 L 115,115 L 140,85 Z"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="1.5"
                className="transition-all"
              />

              {/* Himalayan Seismic Zone V & IV Belt */}
              {(activeHazardFilter === "all" || activeHazardFilter === "seismic") && (
                <g className="animate-pulse">
                  <path
                    d="M 175,45 Q 240,75 320,115"
                    stroke="#ef4444"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.75"
                  />
                  <text x="210" y="58" fill="#fca5a5" fontSize="9" fontWeight="bold">Himalayan Zone V Belt</text>
                  <circle cx="130" cy="140" r="16" fill="url(#seismicBelt)" stroke="#ef4444" strokeWidth="1" />
                  <text x="135" y="143" fill="#fca5a5" fontSize="8" fontWeight="bold">Kutch Zone V</text>
                </g>
              )}

              {/* Ganga-Brahmaputra Flood Plain Basin */}
              {(activeHazardFilter === "all" || activeHazardFilter === "flood") && (
                <g>
                  <path
                    d="M 175,100 Q 220,125 290,128"
                    stroke="#06b6d4"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.8"
                  />
                  <text x="200" y="118" fill="#67e8f9" fontSize="9" fontWeight="bold">Indo-Gangetic Flood Basin</text>
                </g>
              )}

              {/* Bay of Bengal Cyclone Coastal Corridor */}
              {(activeHazardFilter === "all" || activeHazardFilter === "cyclone") && (
                <g>
                  <path
                    d="M 260,135 Q 255,190 205,265"
                    stroke="#a855f7"
                    strokeWidth="7"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.7"
                    strokeDasharray="4 2"
                  />
                  <text x="250" y="210" fill="#d8b4fe" fontSize="9" fontWeight="bold">Bay of Bengal Cyclone Belt</text>
                </g>
              )}

              {/* Central India Heatwave Zone */}
              {(activeHazardFilter === "all" || activeHazardFilter === "fire") && (
                <g>
                  <circle cx="190" cy="160" r="32" fill="#f97316" fillOpacity="0.25" stroke="#f97316" strokeWidth="1.5" />
                  <text x="160" y="162" fill="#fdba74" fontSize="9" fontWeight="bold">Peak Heat Corridor (&gt;45°C)</text>
                </g>
              )}

              {/* Active State Pin Marker */}
              <circle cx="205" cy="120" r="4.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" className="animate-ping" />
              <circle cx="205" cy="120" r="3.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
              <text x="215" y="123" fill="#ffffff" fontSize="9" fontWeight="bold">{selectedState}</text>
            </svg>
          ) : (
            /* State Detailed GIS Layer with Interactive Hotspots */
            <svg viewBox="0 0 400 300" className="w-full h-full p-2">
              <defs>
                <linearGradient id="stateFill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>

              {/* State Contour Polygon */}
              <polygon
                points="60,60 160,35 320,60 360,170 310,250 140,265 50,180"
                fill="url(#stateFill)"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* River / Drainage Embankment Overlay */}
              {(activeHazardFilter === "all" || activeHazardFilter === "flood") && (
                <g>
                  <path
                    d="M 70,80 Q 180,140 330,190"
                    stroke="#0284c7"
                    strokeWidth="4"
                    fill="none"
                    opacity="0.85"
                  />
                  <path
                    d="M 120,50 Q 210,130 300,240"
                    stroke="#0ea5e9"
                    strokeWidth="2.5"
                    strokeDasharray="3 2"
                    fill="none"
                    opacity="0.7"
                  />
                  <text x="80" y="95" fill="#38bdf8" fontSize="8" fontWeight="bold">River Basin Inundation Line</text>
                </g>
              )}

              {/* Fault Line / Seismic Overlay */}
              {(activeHazardFilter === "all" || activeHazardFilter === "seismic") && (
                <g>
                  <path
                    d="M 80,45 Q 220,55 340,90"
                    stroke="#ef4444"
                    strokeWidth="3.5"
                    strokeDasharray="4 3"
                    fill="none"
                    opacity="0.8"
                  />
                  <text x="160" y="45" fill="#fca5a5" fontSize="8" fontWeight="bold">Seismic Fault Line (IS 1893)</text>
                </g>
              )}

              {/* Interactive Hotspot Pins */}
              {stateData.hotspots.map((hs) => {
                const posX = (hs.x / 100) * 360 + 20;
                const posY = (hs.y / 100) * 240 + 30;
                const isSelected = activeHotspot?.id === hs.id;
                const isSafe = hs.type === "safe_zone" || hs.type === "evacuation_point";

                return (
                  <g
                    key={hs.id}
                    className="cursor-pointer transition-transform hover:scale-125"
                    onClick={() => setActiveHotspot(hs)}
                  >
                    <circle
                      cx={posX}
                      cy={posY}
                      r={isSelected ? 9 : 6.5}
                      fill={isSafe ? "#10b981" : "#ef4444"}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      className={isSelected ? "animate-bounce" : ""}
                    />
                    <text
                      x={posX + 10}
                      y={posY + 3}
                      fill="#ffffff"
                      fontSize="8.5"
                      fontWeight="bold"
                      className="drop-shadow-md"
                    >
                      {hs.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}

          {/* Top Overlay Indicator */}
          <div className="absolute top-2.5 left-3 flex items-center gap-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/15">
              {mapMode === "national" ? "National Hazard Overlay" : `${selectedState} GIS Map Layer`}
            </span>
          </div>

          {/* Bottom Hotspot Quick Inspection Card */}
          {activeHotspot && (
            <div className="absolute bottom-2.5 inset-x-2.5 bg-black/85 backdrop-blur-md border border-white/20 p-2.5 rounded-xl shadow-2xl flex items-center justify-between text-left">
              <div className="space-y-0.5 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${activeHotspot.type === "safe_zone" ? "bg-emerald-400" : "bg-red-400"}`} />
                  <p className="text-xs font-bold text-white">{activeHotspot.name}</p>
                  <Badge variant="outline" className="text-[9px] py-0 border-white/20 text-white/80">
                    {activeHotspot.label}
                  </Badge>
                </div>
                <p className="text-[10px] text-white/80 line-clamp-1">{activeHotspot.details}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActiveHotspot(null)}
                className="h-6 w-6 p-0 text-white/70 hover:text-white"
              >
                ✕
              </Button>
            </div>
          )}
        </div>
      )}

      {/* State Vulnerability Scorecard */}
      <Card className="border-border shadow-sm">
        <CardHeader className="py-2.5 px-3.5 border-b flex flex-row items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-bold">
              {selectedState} Vulnerability Metrics
            </CardTitle>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-muted-foreground">Vulnerability Index:</span>
            <Badge 
              variant="outline" 
              className={`text-xs font-bold ${
                stateData.overallScore >= 80 
                  ? "bg-alert-critical/15 text-alert-critical border-alert-critical/30" 
                  : "bg-alert-warning/15 text-alert-warning border-alert-warning/30"
              }`}
            >
              {stateData.overallScore}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-3 space-y-2.5">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div 
              onClick={() => setSelectedModal("earthquake")}
              className="p-2.5 rounded-xl bg-alert-critical/10 border border-alert-critical/20 cursor-pointer hover:bg-alert-critical/15 transition-all"
            >
              <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">Seismic Zone</p>
              <p className="font-bold text-alert-critical text-xs mt-0.5 truncate">{stateData.seismicZone}</p>
            </div>

            <div 
              onClick={() => setSelectedModal("flood")}
              className="p-2.5 rounded-xl bg-alert-info/10 border border-alert-info/20 cursor-pointer hover:bg-alert-info/15 transition-all"
            >
              <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">Flood Risk</p>
              <p className="font-bold text-alert-info text-xs mt-0.5 truncate">{stateData.floodRisk}</p>
            </div>

            <div 
              onClick={() => setSelectedModal("fire")}
              className="p-2.5 rounded-xl bg-alert-warning/10 border border-alert-warning/20 cursor-pointer hover:bg-alert-warning/15 transition-all"
            >
              <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">Fire & Heat Risk</p>
              <p className="font-bold text-alert-warning text-xs mt-0.5 truncate">{stateData.fireRisk}</p>
            </div>

            <div 
              onClick={() => setSelectedModal("cyclone")}
              className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 cursor-pointer hover:bg-purple-500/15 transition-all"
            >
              <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">Cyclone & Wind</p>
              <p className="font-bold text-purple-400 text-xs mt-0.5 truncate">{stateData.cycloneRisk}</p>
            </div>
          </div>

          {/* Primary Regional Hazard Threats */}
          <div className="pt-1">
            <h4 className="font-bold text-xs mb-1 text-foreground flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-alert-critical" />
              Primary Regional Threats in {selectedState}:
            </h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {stateData.keyHazards.map((hazard, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-alert-critical font-bold mt-0.5">•</span>
                  <span>{hazard}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Spatial Protocols Quick Actions */}
      <Card className="border-border shadow-sm">
        <CardHeader className="py-2.5 px-3.5 border-b">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Spatial Emergency Protocols</span>
            <span className="text-[10px] text-primary lowercase font-normal">tap to inspect</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-9 justify-start font-medium"
              onClick={() => setSelectedModal("safezones")}
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-alert-safe" />
              Safe Assembly Grounds
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-9 justify-start font-medium"
              onClick={() => setSelectedModal("evacuation")}
            >
              <Compass className="w-3.5 h-3.5 mr-1.5 text-primary" />
              Evacuation Routes
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-9 justify-start font-medium"
              onClick={() => setSelectedModal("historical")}
            >
              <History className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
              Historical Benchmarks
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-9 justify-start font-medium"
              onClick={() => setSelectedModal("livefeed")}
            >
              <Radio className="w-3.5 h-3.5 mr-1.5 text-alert-critical animate-pulse" />
              Radar Telemetry Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Modal Dialogs */}
      {selectedModal && (
        <Dialog open={!!selectedModal} onOpenChange={() => setSelectedModal(null)}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center">
                {selectedModal === "earthquake" && <AlertTriangle className="w-5 h-5 mr-2 text-alert-critical" />}
                {selectedModal === "flood" && <Waves className="w-5 h-5 mr-2 text-alert-info" />}
                {selectedModal === "fire" && <Flame className="w-5 h-5 mr-2 text-alert-warning" />}
                {selectedModal === "cyclone" && <Wind className="w-5 h-5 mr-2 text-purple-400" />}
                {selectedModal === "safezones" && <ShieldCheck className="w-5 h-5 mr-2 text-alert-safe" />}
                {selectedModal === "evacuation" && <Compass className="w-5 h-5 mr-2 text-primary" />}
                {selectedModal === "historical" && <History className="w-5 h-5 mr-2 text-amber-500" />}
                {selectedModal === "livefeed" && <Radio className="w-5 h-5 mr-2 text-alert-critical" />}
                
                {selectedModal === "earthquake" && `Seismic Hazard Map: ${selectedState}`}
                {selectedModal === "flood" && `Flood Catchment Overlay: ${selectedState}`}
                {selectedModal === "fire" && `Fire & Heat Hazard: ${selectedState}`}
                {selectedModal === "cyclone" && `Wind & Storm Zone: ${selectedState}`}
                {selectedModal === "safezones" && `Verified Safe Assembly Grounds (${selectedState})`}
                {selectedModal === "evacuation" && `Standard Evacuation Routes (${selectedState})`}
                {selectedModal === "historical" && `Major Historical Events in ${selectedState}`}
                {selectedModal === "livefeed" && `IMD & CWC Telemetry Feed`}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Official Geological Survey of India & NDMA spatial safety metrics
              </DialogDescription>
            </DialogHeader>

            <div className="py-2 text-xs space-y-3">
              {selectedModal === "earthquake" && (
                <div className="space-y-2">
                  <p className="leading-relaxed">
                    <strong>Classification:</strong> {stateData.seismicZone} ({stateData.seismicLevel})
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Structures must comply with Bureau of Indian Standards (BIS) IS 1893 seismic engineering criteria.
                  </p>
                  <div className="bg-muted p-2.5 rounded-xl border border-border">
                    <p className="font-semibold text-foreground mb-1">Key Action for Institutions:</p>
                    <p className="text-muted-foreground">Anchor heavy physics/chemistry lab apparatus and library shelves to structural columns. Identify open playgrounds away from glass windows as primary assembly areas.</p>
                  </div>
                </div>
              )}

              {selectedModal === "flood" && (
                <div className="space-y-2">
                  <p className="leading-relaxed">
                    <strong>Flood Rating:</strong> {stateData.floodRisk}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Low-lying riverine basins and urban drainage bottlenecks are mapped via Central Water Commission telemetry.
                  </p>
                  <div className="bg-muted p-2.5 rounded-xl border border-border">
                    <p className="font-semibold text-foreground mb-1">Evacuation Precaution:</p>
                    <p className="text-muted-foreground">Never walk or drive across flooded culverts or submerged railway underpasses. Keep emergency dry rations on the highest floor.</p>
                  </div>
                </div>
              )}

              {selectedModal === "safezones" && (
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">Verified Emergency Assembly Points in {selectedState}:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    {stateData.safeZones.map((sz, idx) => (
                      <li key={idx} className="flex items-start space-x-2 p-2 rounded-lg bg-muted/60 border border-border">
                        <ShieldCheck className="w-4 h-4 text-alert-safe shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-foreground">{sz}</p>
                          <p className="text-[11px] text-muted-foreground">Designated open perimeter away from structural collapse risks.</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedModal === "evacuation" && (
                <div className="space-y-2">
                  <p className="leading-relaxed">
                    <strong>Evacuation Direction:</strong> {stateData.evacuationProtocol}
                  </p>
                  <div className="bg-primary/10 border border-primary/20 p-2.5 rounded-xl text-primary">
                    <p className="font-semibold mb-0.5">School Attendance Protocol:</p>
                    <p className="text-xs">Class teachers must conduct physical headcount verification before proceeding along designated green escape corridors.</p>
                  </div>
                </div>
              )}

              {selectedModal === "historical" && (
                <div className="space-y-2">
                  <p className="leading-relaxed font-semibold text-foreground">
                    Historical Benchmark Event:
                  </p>
                  <p className="p-3 bg-muted rounded-xl border border-border leading-relaxed text-muted-foreground text-xs">
                    {stateData.historicalEvent}
                  </p>
                </div>
              )}

              {selectedModal === "livefeed" && (
                <div className="space-y-2">
                  <p className="leading-relaxed">
                    <strong>Telemetry Feeds:</strong> Connected to IMD Doppler Weather Radar and Central Water Commission hydrological monitoring stations for {selectedState}.
                  </p>
                  <div className="flex items-center space-x-2 p-2.5 bg-alert-safe/10 border border-alert-safe/30 rounded-xl text-alert-safe font-medium">
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>Radar & River Telemetry Feeds: LIVE & OPERATIONAL</span>
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
