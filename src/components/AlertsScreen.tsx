import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle, Clock, MapPin, Share2,
  Filter, Bell, Zap, Cloud, Waves, Flame, Wind,
  CheckCircle, XCircle, PhoneCall, ExternalLink, RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { getAlertsForLocation, SafetyAlert, STATE_ALERT_DATABASE } from "@/lib/alertsData";

interface AlertsScreenProps {
  userState: string;
  userCity?: string;
  onNavigate?: (screen: string) => void;
  onStateChange?: (newState: string) => void;
}

const INDIAN_STATES = [
  "Uttar Pradesh", "Punjab", "Delhi", "Maharashtra", "Bihar", 
  "Uttarakhand", "West Bengal", "Odisha", "Gujarat", "Rajasthan", 
  "Kerala", "Tamil Nadu", "Assam", "Himachal Pradesh", "Haryana",
  "Madhya Pradesh", "Karnataka", "Andhra Pradesh", "Telangana"
];

const AlertsScreen = ({ userState, userCity, onNavigate, onStateChange }: AlertsScreenProps) => {
  const [activeState, setActiveState] = useState<string>(userState || "Uttar Pradesh");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [selectedAlertForGuidelines, setSelectedAlertForGuidelines] = useState<SafetyAlert | null>(null);
  const [selectedAlertForActions, setSelectedAlertForActions] = useState<SafetyAlert | null>(null);
  
  const { toast } = useToast();

  // Fetch accurate alerts for this location
  const allAlerts = useMemo(() => {
    return getAlertsForLocation(activeState, userCity);
  }, [activeState, userCity]);

  // Filter alerts by severity and hazard category
  const filteredAlerts = useMemo(() => {
    return allAlerts.filter(alert => {
      const matchSeverity = severityFilter === "all" || alert.type === severityFilter;
      const matchCategory = categoryFilter === "all" || alert.category === categoryFilter;
      return matchSeverity && matchCategory;
    });
  }, [allAlerts, severityFilter, categoryFilter]);

  const criticalAlert = useMemo(() => {
    return allAlerts.find(a => a.type === "critical");
  }, [allAlerts]);

  const severityOptions = [
    { id: "all", label: "All Alerts" },
    { id: "critical", label: "Critical" },
    { id: "warning", label: "Warning" },
    { id: "info", label: "Info" }
  ];

  const categoryOptions = [
    { id: "all", label: "All Hazards" },
    { id: "flood", label: "Floods & Rivers" },
    { id: "weather", label: "Weather & Rain" },
    { id: "earthquake", label: "Earthquake" },
    { id: "cyclone", label: "Cyclone & Sea" },
    { id: "heatwave", label: "Heatwave" },
    { id: "air_quality", label: "Air Quality" }
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical": return "border-l-alert-critical bg-alert-critical/5";
      case "warning": return "border-l-alert-warning bg-alert-warning/5";
      case "info": return "border-l-alert-info bg-alert-info/5";
      case "safe": return "border-l-alert-safe bg-alert-safe/5";
      default: return "border-l-muted";
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "critical": return "destructive";
      case "warning": return "secondary";
      case "info": return "outline";
      case "safe": return "default";
      default: return "secondary";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "flood": return Waves;
      case "weather": return Cloud;
      case "cyclone": return Wind;
      case "heatwave": return Flame;
      case "earthquake": return AlertTriangle;
      default: return Bell;
    }
  };

  const formatDisplayTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString([], {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      }) + ", " + d.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Recently Updated";
    }
  };

  const handleShare = (alert: SafetyAlert) => {
    const message = `🚨 SAJAG ALERT [${alert.type.toUpperCase()}]: ${alert.title}\n\n${alert.description}\n\n📍 Location: ${alert.location}\n📡 Source: ${alert.source}\n📞 Emergency Helpline: ${alert.helpline}\n\nStay prepared with Sajag India!`;

    if (navigator.share) {
      navigator.share({
        title: alert.title,
        text: message
      }).catch(() => {
        navigator.clipboard.writeText(message);
        toast({
          title: "Alert copied to clipboard",
          description: "Ready to share with friends and family."
        });
      });
    } else {
      navigator.clipboard.writeText(message);
      toast({
        title: "Alert details copied to clipboard",
        description: "You can paste and share this alert on WhatsApp or SMS."
      });
    }
  };

  const handleSelectState = (stateName: string) => {
    setActiveState(stateName);
    setShowLocationDialog(false);
    if (onStateChange) {
      onStateChange(stateName);
    }
    toast({
      title: `Location set to ${stateName}`,
      description: `Loaded verified official alerts for ${stateName}.`
    });
  };

  const handleCallEmergency = (phone: string = "112") => {
    window.location.href = `tel:${phone}`;
    toast({
      title: `Dialing Emergency Helpline: ${phone}`,
      description: "Connecting to emergency response services..."
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Bell className="w-5 h-5 mr-2 text-primary" />
            Safety Alerts
          </h2>
          <p className="text-sm text-muted-foreground">
            Official NDMA & IMD safety warnings
          </p>
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilterDialog(true)}
            title="Filter by hazard"
            className="flex items-center space-x-1"
          >
            <Filter className="w-4 h-4" />
            {categoryFilter !== "all" && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </Button>
        </div>
      </div>

      {/* Active Location Indicator & Switcher */}
      <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-lg p-2.5 text-xs">
        <div className="flex items-center space-x-1.5 min-w-0">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <span className="text-muted-foreground">Location:</span>
          <span className="font-semibold text-primary truncate">
            {activeState}
          </span>
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => setShowLocationDialog(true)}
          className="h-7 text-xs px-2.5 font-medium"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Change State
        </Button>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {severityOptions.map((option) => (
          <Button
            key={option.id}
            variant={severityFilter === option.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setSeverityFilter(option.id)}
            className="flex-1 text-xs"
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Active Critical Alert Banner */}
      {criticalAlert && (
        <Card 
          className="border-alert-critical bg-alert-critical/10 hover:bg-alert-critical/15 cursor-pointer transition-all shadow-sm"
          onClick={() => setSelectedAlertForActions(criticalAlert)}
        >
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-alert-critical animate-pulse shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-alert-critical">
                    Active Critical Alert in {activeState}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tap to view immediate emergency response actions
                  </p>
                </div>
              </div>
              <Button size="sm" variant="destructive" className="h-7 text-xs shrink-0">
                Action Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Category Filter Tag if applied */}
      {categoryFilter !== "all" && (
        <div className="flex items-center justify-between bg-muted/60 px-3 py-1.5 rounded-md text-xs">
          <span>Filtering by: <strong>{categoryOptions.find(c => c.id === categoryFilter)?.label}</strong></span>
          <button 
            onClick={() => setCategoryFilter("all")} 
            className="text-primary hover:underline font-medium"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const Icon = getCategoryIcon(alert.category);
            return (
              <Card
                key={alert.id}
                className={`border-l-4 ${getAlertColor(alert.type)} transition-all hover:shadow-md`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-full shrink-0 ${
                        alert.type === "critical" ? "bg-alert-critical" :
                        alert.type === "warning" ? "bg-alert-warning" :
                        alert.type === "info" ? "bg-alert-info" : "bg-alert-safe"
                      }`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1 flex-wrap gap-1">
                          <h3 className="text-sm font-bold leading-tight">{alert.title}</h3>
                          <Badge variant={getBadgeVariant(alert.type)} className="text-xs">
                            {alert.type.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">
                          {alert.description}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center text-xs text-muted-foreground gap-1.5 sm:gap-3">
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1 text-primary shrink-0" />
                            {alert.location}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1 shrink-0" />
                            {formatDisplayTime(alert.time)}
                          </span>
                          <span className="font-medium text-foreground/80">Source: {alert.source}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(alert)}
                      className="p-1.5 h-auto text-muted-foreground hover:text-foreground shrink-0"
                      title="Share Alert"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {alert.actionable && (
                    <div className="flex space-x-2 pt-1 border-t border-border/50">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs flex-1"
                        onClick={() => setSelectedAlertForGuidelines(alert)}
                      >
                        View Guidelines
                      </Button>
                      {alert.type === "critical" ? (
                        <Button 
                          size="sm" 
                          className="text-xs flex-1 bg-alert-critical hover:bg-alert-critical/90 text-white font-medium"
                          onClick={() => setSelectedAlertForActions(alert)}
                        >
                          Emergency Actions
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="text-xs flex-1"
                          onClick={() => handleCallEmergency(alert.helpline.split(" ")[0])}
                        >
                          <PhoneCall className="w-3 h-3 mr-1" />
                          Call Helpline
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-8 text-center space-y-2">
              <Bell className="w-8 h-8 text-muted-foreground mx-auto" />
              <h3 className="font-medium">No matching alerts found</h3>
              <p className="text-xs text-muted-foreground">
                No active {severityFilter !== "all" ? severityFilter : ""} warnings for {activeState} under current filters.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => { setSeverityFilter("all"); setCategoryFilter("all"); }}
                className="mt-2 text-xs"
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Safety Guidelines Modal */}
      {selectedAlertForGuidelines && (
        <Dialog open={!!selectedAlertForGuidelines} onOpenChange={() => setSelectedAlertForGuidelines(null)}>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center space-x-2">
                <Badge variant={getBadgeVariant(selectedAlertForGuidelines.type)}>
                  {selectedAlertForGuidelines.type.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">{selectedAlertForGuidelines.source}</span>
              </div>
              <DialogTitle className="text-base font-bold text-left pt-1">
                {selectedAlertForGuidelines.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-left">
                📍 {selectedAlertForGuidelines.location}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-sm">
              <div className="bg-muted p-3 rounded-lg text-xs leading-relaxed">
                {selectedAlertForGuidelines.description}
              </div>

              {/* Actionable DOs */}
              <div className="space-y-1.5">
                <h4 className="font-semibold text-xs text-alert-safe flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1.5 text-alert-safe" />
                  What to Do (Immediate Safety Steps):
                </h4>
                <ul className="space-y-1 text-xs text-muted-foreground pl-1">
                  {selectedAlertForGuidelines.dos.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-primary font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actionable DONTs */}
              <div className="space-y-1.5">
                <h4 className="font-semibold text-xs text-alert-critical flex items-center">
                  <XCircle className="w-4 h-4 mr-1.5 text-alert-critical" />
                  What NOT to Do:
                </h4>
                <ul className="space-y-1 text-xs text-muted-foreground pl-1">
                  {selectedAlertForGuidelines.donts.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-alert-critical font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-primary/5 border border-primary/20 p-2.5 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium">Direct Helpline:</p>
                  <p className="text-primary font-bold">{selectedAlertForGuidelines.helpline}</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleCallEmergency("112")}
                  className="h-7 text-xs bg-primary hover:bg-primary/90"
                >
                  <PhoneCall className="w-3 h-3 mr-1" /> Call 112
                </Button>
              </div>
            </div>

            <DialogFooter className="flex flex-row space-x-2 sm:justify-end">
              {onNavigate && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs"
                  onClick={() => {
                    setSelectedAlertForGuidelines(null);
                    onNavigate("learning");
                  }}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Learn Full Guide
                </Button>
              )}
              <Button 
                size="sm" 
                className="flex-1 text-xs"
                onClick={() => setSelectedAlertForGuidelines(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Emergency Actions Modal */}
      {selectedAlertForActions && (
        <Dialog open={!!selectedAlertForActions} onOpenChange={() => setSelectedAlertForActions(null)}>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto border-alert-critical">
            <DialogHeader>
              <div className="flex items-center space-x-2">
                <Badge variant="destructive">CRITICAL RESPONSE</Badge>
                <Zap className="w-4 h-4 text-alert-critical animate-pulse" />
              </div>
              <DialogTitle className="text-base font-bold text-left pt-1 text-alert-critical">
                Emergency Action Protocol: {selectedAlertForActions.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-left">
                Urgent priority actions for {activeState}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-sm">
              <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg text-xs font-medium text-destructive">
                ⚠️ If you or your school are in immediate physical danger, evacuate to a secure location and dial 112 immediately.
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-xs">Priority Evacuation & Survival Steps:</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2 bg-muted rounded border border-border flex items-start space-x-2">
                    <span className="font-bold text-primary">1.</span>
                    <span><strong>Assemble Instantly:</strong> Move students and family to designated safe assembly areas away from fragile structures and floodwaters.</span>
                  </div>
                  <div className="p-2 bg-muted rounded border border-border flex items-start space-x-2">
                    <span className="font-bold text-primary">2.</span>
                    <span><strong>Grab Emergency Kit:</strong> Take your emergency kit containing flashlight, potable water, medications, and whistle.</span>
                  </div>
                  <div className="p-2 bg-muted rounded border border-border flex items-start space-x-2">
                    <span className="font-bold text-primary">3.</span>
                    <span><strong>Power Shutoff:</strong> Disconnect main electrical breaker switches before water enters premises.</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button 
                  className="bg-alert-critical hover:bg-alert-critical/90 text-white font-bold text-xs h-9"
                  onClick={() => handleCallEmergency("112")}
                >
                  <PhoneCall className="w-4 h-4 mr-1" />
                  Call 112 Emergency
                </Button>
                <Button 
                  variant="outline" 
                  className="text-xs h-9 border-primary text-primary"
                  onClick={() => {
                    setSelectedAlertForActions(null);
                    if (onNavigate) onNavigate("emergency");
                  }}
                >
                  Emergency Directory
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => setSelectedAlertForActions(null)}
              >
                Dismiss Action Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Location Switcher Modal */}
      {showLocationDialog && (
        <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                Select State for Local Alerts
              </DialogTitle>
              <DialogDescription className="text-xs">
                Choose any Indian state to view its real-time disaster alerts, river basins, and meteorological warnings.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-2 py-2">
              {INDIAN_STATES.map((state) => (
                <Button
                  key={state}
                  variant={activeState === state ? "default" : "outline"}
                  size="sm"
                  className="text-xs justify-start truncate h-8"
                  onClick={() => handleSelectState(state)}
                >
                  <MapPin className="w-3 h-3 mr-1.5 shrink-0 opacity-70" />
                  <span className="truncate">{state}</span>
                </Button>
              ))}
            </div>

            <DialogFooter>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => setShowLocationDialog(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Hazard Category Filter Modal */}
      {showFilterDialog && (
        <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center">
                <Filter className="w-4 h-4 mr-2 text-primary" />
                Filter by Disaster Hazard
              </DialogTitle>
              <DialogDescription className="text-xs">
                Select a specific disaster category to display
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-1.5 py-2">
              {categoryOptions.map((opt) => (
                <Button
                  key={opt.id}
                  variant={categoryFilter === opt.id ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start text-xs h-8"
                  onClick={() => {
                    setCategoryFilter(opt.id);
                    setShowFilterDialog(false);
                  }}
                >
                  {opt.label}
                </Button>
              ))}
            </div>

            <DialogFooter>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => setShowFilterDialog(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AlertsScreen;
