import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle, Clock, MapPin, Share2,
  Filter, Bell, Zap, Cloud, Waves, Flame
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AlertsScreenProps {
  userState: string;
}

const AlertsScreen = ({ userState }: AlertsScreenProps) => {
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();

  const hardcodedAlerts = [
    {
      id: 1,
      type: "warning",
      category: "warning",
      title: "Heavy Rainfall Warning",
      description: "Heavy rainfall is expected in the northern districts for the next 48 hours. Low-lying areas may experience waterlogging.",
      location: userState,
      time: "Mon, 22 Sep 2025 08:00:00 GMT",
      source: "IMD",
      icon: Cloud,
      actionable: true,
    },
    {
      id: 3,
      type: "critical",
      category: "critical",
      title: "Flash Flood Alert in Rupnagar",
      description: "Urgent: Flash flood warning issued for areas along the Sutlej river in Rupnagar due to dam water release. Evacuate low-lying areas immediately.",
      location: "Rupnagar",
      time: "Sun, 21 Sep 2025 22:45:00 GMT",
      source: "NDMA",
      icon: Waves,
      actionable: true,
    },
  ];
  
  const [alerts] = useState<any[]>(hardcodedAlerts);
  const isLoading = false;
  const error = null;

  const filterOptions = [
    { id: "all", label: "All Alerts" },
    { id: "critical", label: "Critical" },
    { id: "warning", label: "Warning" },
    { id: "info", label: "Info" }
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

  const handleShare = (alert: any) => {
    const message = `🚨 ALERT: ${alert.title}\n\n${alert.description}\n\nLocation: ${alert.location}\nSource: ${alert.source}\n\nStay safe! - Sajag India`;

    if (navigator.share) {
      navigator.share({
        title: alert.title,
        text: message
      });
    } else {
      navigator.clipboard.writeText(message);
      toast({
        title: "Alert copied to clipboard",
        description: "Share this alert with family and friends"
      });
    }
  };

  const filteredAlerts = filter === "all"
    ? alerts
    : alerts.filter(alert => alert.type === filter);

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
            Latest safety information and warnings
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {filterOptions.map((option) => (
          <Button
            key={option.id}
            variant={filter === option.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter(option.id)}
            className="flex-1 text-xs"
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Active Alert Banner */}
      {alerts.some(alert => alert.type === "critical") && (
        <Card className="border-alert-critical bg-alert-critical/10">
          <CardContent className="p-3">
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-alert-critical mr-2 animate-pulse" />
              <div>
                <p className="text-sm font-medium text-alert-critical">
                  Active Critical Alert
                </p>
                <p className="text-xs text-muted-foreground">
                  Tap to view emergency response actions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts List */}
      <div className="space-y-3">
        {isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <h3 className="font-medium mb-1">Fetching real-time alerts...</h3>
              <p className="text-sm text-muted-foreground">
                This may take a moment.
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && error && (
          <Card className="border-destructive text-destructive">
            <CardContent className="p-4 flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold text-sm">Error fetching alerts</h3>
                <p className="text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && filteredAlerts.length > 0 && filteredAlerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <Card
              key={alert.id}
              className={`border-l-4 ${getAlertColor(alert.type)} transition-all hover:shadow-md`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-full ${
                      alert.type === "critical" ? "bg-alert-critical" :
                      alert.type === "warning" ? "bg-alert-warning" :
                      alert.type === "info" ? "bg-alert-info" : "bg-alert-safe"
                    }`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-semibold">{alert.title}</h3>
                        <Badge variant={getBadgeVariant(alert.type)} className="text-xs">
                          {alert.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.description}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground space-x-3">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {alert.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(alert.time).toLocaleString()}
                        </span>
                        <span>Source: {alert.source}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(alert)}
                    className="p-1 h-auto"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                {alert.actionable && (
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      View Guidelines
                    </Button>
                    {alert.type === "critical" && (
                      <Button size="sm" className="text-xs bg-alert-critical hover:bg-alert-critical/90">
                        Emergency Actions
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {!isLoading && filteredAlerts.length === 0 && !error && (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <h3 className="font-medium mb-1">No alerts found for {userState}</h3>
            <p className="text-sm text-muted-foreground">
              No alerts at this time. Stay prepared!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AlertsScreen;

