import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, Search, MapPin, 
  Hospital, Shield, Flame, Car, 
  Star, PhoneCall
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getContactsForState, EmergencyContact } from "@/lib/emergencyContacts";

interface EmergencyDirectoryProps {
  userState?: string;
  userCity?: string;
}

const EmergencyDirectory = ({ userState = "Uttar Pradesh", userCity }: EmergencyDirectoryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  const categories = [
    { id: "all", label: "All", icon: Search },
    { id: "emergency", label: "Helpline", icon: Shield },
    { id: "hospital", label: "Medical", icon: Hospital },
    { id: "police", label: "Police", icon: Shield },
    { id: "fire", label: "Fire", icon: Flame },
    { id: "rescue", label: "Rescue", icon: Car }
  ];

  const allContacts = useMemo(() => {
    return getContactsForState(userState, userCity);
  }, [userState, userCity]);

  const filteredContacts = useMemo(() => {
    return allContacts.filter(contact => {
      const matchesCategory = selectedCategory === "all" || contact.category === selectedCategory;
      const matchesSearch = 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [allContacts, selectedCategory, searchQuery]);

  const handleCall = (phone: string, name: string) => {
    window.location.href = `tel:${phone}`;
    toast({
      title: "Initiating Call: " + name,
      description: `Dialing ${phone}... Stay calm and state your location clearly.`
    });
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "hospital": return "bg-alert-info text-white";
      case "police": return "bg-primary text-white";
      case "fire": return "bg-alert-warning text-white";
      case "rescue": return "bg-alert-critical text-white";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold flex items-center">
          <Phone className="w-5 h-5 mr-2 text-primary" />
          Emergency Directory
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          24/7 Verified emergency helplines for {userState}
        </p>
      </div>

      {/* Priority 112 Banner */}
      <Card className="border-alert-critical bg-alert-critical/10 shadow-sm">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-full bg-alert-critical flex items-center justify-center text-white shrink-0">
                <PhoneCall className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-bold text-alert-critical">
                  National Emergency: 112
                </p>
                <p className="text-xs text-muted-foreground">
                  Immediate all-in-one Police, Fire & Medical dispatch
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              className="bg-alert-critical hover:bg-alert-critical/90 text-white font-bold text-xs h-8"
              onClick={() => handleCall("112", "National Emergency 112")}
            >
              Call 112
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
        <Input
          placeholder="Search by hospital, police, helpline, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 text-xs h-10"
        />
      </div>

      {/* Category Pills */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="text-xs h-7 shrink-0 px-2.5"
            >
              <Icon className="w-3 h-3 mr-1" />
              {category.label}
            </Button>
          );
        })}
      </div>

      {/* Contacts List */}
      <div className="space-y-3">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-md transition-all border-border/80">
              <CardContent className="p-3.5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center space-x-1.5 mb-1 flex-wrap gap-1">
                      <h3 className="font-bold text-sm leading-tight">{contact.name}</h3>
                      {contact.isNational && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-primary text-primary">
                          National
                        </Badge>
                      )}
                      <Badge className={`text-[10px] px-1.5 py-0 h-4 ${getCategoryBadgeColor(contact.category)}`}>
                        {contact.category.toUpperCase()}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground mb-1.5">
                      {contact.description}
                    </p>

                    <div className="flex items-center text-xs text-muted-foreground space-x-2">
                      <MapPin className="w-3 h-3 text-primary shrink-0" />
                      <span className="truncate">{contact.address}</span>
                    </div>

                    <div className="flex items-center text-[11px] text-muted-foreground mt-1 space-x-3">
                      <span className="font-medium text-foreground/80">{contact.distance}</span>
                      <span className="flex items-center text-amber-500 font-semibold">
                        <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                        {contact.rating}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary-hover text-white text-xs px-3 h-8 shrink-0 flex items-center space-x-1"
                    onClick={() => handleCall(contact.phone, contact.name)}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center space-y-2">
              <Phone className="w-8 h-8 text-muted-foreground mx-auto" />
              <h3 className="font-medium">No contacts match your query</h3>
              <p className="text-xs text-muted-foreground">
                Try searching for "Police", "Ambulance", "112", or clear the filter.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
                className="mt-2 text-xs"
              >
                Reset Search
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmergencyDirectory;
