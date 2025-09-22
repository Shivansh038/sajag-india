import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gamepad2, Play, ChevronLeft } from "lucide-react";

// Define the structure for a game, including its URL
interface Game {
  name: string;
  description: string;
  url: string;
  icon: React.ElementType;
  color: string;
}

// Array of games with their respective links
const gameList: Game[] = [
  {
    name: "Escape Maze",
    description: "Navigate safely through a disaster while collecting emergency items",
    url: "https://disaster-escape-maze.vercel.app",
    icon: Gamepad2,
    color: "bg-primary",
  },
  {
    name: "Emergency Kit Building",
    description: "Learn how to build an emergency kit for disaster",
    url: "https://emergency-kit-game.vercel.app/",
    icon: Gamepad2,
    color: "bg-alert-info",
  },
  {
    name: "Hero vs Flood",
    description: "Fun quiz game",
    url: "https://hero-vs-flood.vercel.app/", // Placeholder URL
    icon: Gamepad2,
    color: "bg-alert-warning",
  },
  {
    name: "Cyclone Preparedness",
    description: "Prepare for cyclone emergencies",
    url: "https://another-game-link.com/cyclone", // Placeholder URL
    icon: Gamepad2,
    color: "bg-achievement",
  },
];


const Games = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-bold flex items-center">
          <Gamepad2 className="w-5 h-5 mr-2 text-primary" />
          Interactive Games
        </h2>
      </div>

      <p className="text-sm text-muted-foreground">
        Learn disaster preparedness through fun games
      </p>

      {/* Games Grid */}
      <div className="space-y-3">
        {gameList.map((game) => {
          const Icon = game.icon;
          return (
            <Card key={game.name} className="hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${game.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{game.name}</h3>
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                  </div>
                  <a href={game.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm">
                      <Play className="w-4 h-4 mr-1" />
                      Play
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Games;

