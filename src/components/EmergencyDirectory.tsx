import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, Search, MapPin, Clock, 
  Hospital, Shield, Flame, Car, 
  Navigation, Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmergencyDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  const categories = [
    { id: "all", label: "All", icon: Search },
    { id: "hospital", label: "Medical", icon: Hospital },
    { id: "police", label: "Police", icon: Shield },
    { id: "fire", label: "Fire", icon: Flame },
    { id: "rescue", label: "Rescue", icon: Car }
  ];

  const emergencyContacts = [
    {
      id: 1,
      name: "National Emergency Helpline",
      category: "emergency",
      phone: "112",
      description: "Single emergency number for all services",
      address: "Nationwide Service",
      distance: "Available 24/7",
      rating: 5,
      isNational: true
    },
    {
      id: 2,
      name: "AIIMS Emergency",
      category: "hospital", 
      phone: "+91-11-2658-8500",
      description: "Trauma center and emergency medical services",
      address: "Ansari Nagar, New Delhi",
      distance: "2.3 km away",
      rating: 4.5,
      isNational: false
    },
    {
      id: 3,
      name: "Delhi Police Control Room",
      category: "police",
      phone: "100",
      description: "Police emergency response and crime reporting",
      address: "Delhi Police Headquarters",
      distance: "City-wide coverage",
      rating: 4,
      isNational: false
    },
    {
      id: 4,
      name: "Fire Service Station",
      category: "fire",
      phone: "101", 
      description: "Fire emergency response and rescue operations",
      address: "Connaught Place Fire Station",
      distance: "1.8 km away",
      rating: 4.2,
      isNational: false
    },
    {
      id: 5,
      name: "Disaster Management Helpline",
      category: "rescue",
      phone: "108",
      description: "NDMA disaster response coordination",
      address: "NDMA Headquarters",
      distance: "3.5 km away", 
      rating: 4.3,
      isNational: true
    },
    {
      id: 6,
      name: "Safdarjung Hospital",
      category: "hospital",
      phone: "+91-11-2673-0000",
      description: "Multi-specialty hospital with emergency care",
      address: "Ring Road, Safdarjung Enclave",
      distance: "4.1 km away",
      rating: 4.1,
      isNational: false
    }
  ];

  const handleCall = (phone: string, name: string) => {
    // In a real app, this would initiate a call
    window.location.href = `tel:${phone}`;
    toast({
      title: "Calling " + name,
      description: "Initiating emergency call..."
    });
  };

  const handleGetDirections = (name: string) => {
    // In a real app, this would open maps
    toast({
      title: "Opening directions",
      description: `Getting directions to ${name}`
    });
  };

  const filteredContacts = emergencyContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || contact.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "hospital": return "bg-alert-safe";
      case "police": return "bg-primary";
      case "fire": return "bg-alert-critical";
      case "rescue": return "bg-alert-warning";
      default: return "bg-muted";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) 
            ? "text-yellow-500 fill-current" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold flex items-center">
          <Phone className="w-5 h-5 mr-2 text-primary" />
          Emergency Directory
        </h2>
        <p className="text-sm text-muted-foreground">
          Quick access to emergency services near you
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search hospitals, police stations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex-shrink-0"
            >
              <Icon className="w-4 h-4 mr-1" />
              {category.label}
            </Button>
          );
        })}
      </div>

      {/* National Emergency Banner */}
      <Card className="bg-gradient-to-r from-alert-critical to-alert-critical/80 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Emergency? Call 112</h3>
              <p className="text-sm opacity-90">
                Single number for Police, Fire, Medical emergencies
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleCall("112", "National Emergency")}
              className="bg-white text-alert-critical hover:bg-white/90"
            >
              <Phone className="w-4 h-4 mr-1" />
              Call Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts List */}
      <div className="space-y-3">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-sm">{contact.name}</h3>
                    {contact.isNational && (
                      <Badge variant="secondary" className="text-xs">
                        National
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {contact.description}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {contact.address}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Navigation className="w-3 h-3 mr-1" />
                        {contact.distance}
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(contact.rating)}
                        <span className="text-xs text-muted-foreground ml-1">
                          {contact.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`w-2 h-16 rounded-full ${getCategoryColor(contact.category)} ml-3`} />
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleCall(contact.phone, contact.name)}
                  className="flex-1 bg-alert-safe hover:bg-alert-safe/90"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
                <Button
                  size="sm" 
                  variant="outline"
                  onClick={() => handleGetDirections(contact.name)}
                  className="flex-1"
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  Directions
                </Button>
              </div>

              {/* Phone number display */}
              <div className="mt-2 p-2 bg-muted/50 rounded text-center">
                <span className="text-sm font-mono font-medium">
                  {contact.phone}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredContacts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <h3 className="font-medium mb-1">No contacts found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or category filter
            </p>
          </CardContent>
        </Card>
      )}

      {/* Offline Notice */}
      <Card className="bg-alert-info/10 border-alert-info">
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground text-center">
            💡 Critical contacts are available offline for emergency access
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyDirectory;