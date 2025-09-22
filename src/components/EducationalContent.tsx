import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

interface EducationalContentProps {
  title: string;
  text: string;
  videoUrl?: string;
  onBack: () => void;
}

const EducationalContent = ({ title, text, videoUrl, onBack }: EducationalContentProps) => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          {videoUrl && (
            <div className="aspect-video overflow-hidden rounded-lg">
              <iframe
                className="w-full h-full"
                src={videoUrl}
                title="Educational Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
            {text || "Content for this section is not yet available."}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationalContent;
