import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, Pause, Volume2, VolumeX, Heart, Share2, 
  MessageCircle, Bookmark, ChevronUp, ChevronDown 
} from "lucide-react";

interface Reel {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  thumbnail: string;
  videoUrl?: string; // This can be a local path or an external URL
  likes: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

const Reels = () => {
  const [currentReel, setCurrentReel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const [reels, setReels] = useState<Reel[]>([
    {
     id: 2,
      title: "Flood",
      description: "What to do during a flood",
      category: "Flood",
      duration: "1:45",
      thumbnail: "/placeholder-video.jpg",
      videoUrl: "/flood-safety.mp4", // Path to your local MP4 file
      likes: 2156,
      shares: 234,
      isLiked: true,
      isBookmarked: true

    },
    {
      id: 1,
      title: "Earthquake Safety Tips",
      description: "Learn the Drop, Cover, and Hold technique in just 60 seconds! Essential earthquake safety for everyone.",
      category: "Earthquake",
      duration: "1:02",
      thumbnail: "/placeholder-video.jpg",
      videoUrl: "/earthquake-safety.mp4", // Path to your local MP4 file
      likes: 1234,
      shares: 89,
      isLiked: false,
      isBookmarked: false
    },
    {
      id: 2,
      title: "Tsunami",
      description: "",
      category: "Tsunami ",
      duration: "1:45",
      thumbnail: "/placeholder-video.jpg",
      videoUrl: "/Reel3.mp4", // Path to your local MP4 file
      likes: 2156,
      shares: 234,
      isLiked: true,
      isBookmarked: true
    },
    {
      id: 2,
      title: "Cyclone",
      description: "",
      category: "Cyclone",
      duration: "1:45",
      thumbnail: "/placeholder-video.jpg",
      videoUrl: "/Reel4.mp4", // Path to your local MP4 file
      likes: 2156,
      shares: 234,
      isLiked: true,
      isBookmarked: true
    }
  ]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleLike = (reelId: number) => {
    setReels(reels.map(reel => {
      if (reel.id === reelId) {
        return {
          ...reel,
          isLiked: !reel.isLiked,
          likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1
        };
      }
      return reel;
    }));
  };

  const handleBookmark = (reelId: number) => {
    setReels(reels.map(reel => {
      if (reel.id === reelId) {
        return { ...reel, isBookmarked: !reel.isBookmarked };
      }
      return reel;
    }));
  };

  const handleShare = (reel: Reel) => {
    if (navigator.share) {
      navigator.share({
        title: reel.title,
        text: reel.description,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${reel.title}\n${reel.description}\n${window.location.href}`);
    }
  };

  const scrollToReel = (direction: 'up' | 'down') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const newIndex = direction === 'up' 
      ? Math.max(0, currentReel - 1)
      : Math.min(reels.length - 1, currentReel + 1);
    
    setCurrentReel(newIndex);
    container.scrollTo({
      top: newIndex * container.clientHeight,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);
    
    if (newIndex !== currentReel) {
      setCurrentReel(newIndex);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentReel]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentReel && isPlaying) {
          video.play();
        } else {
          video.pause();
        }
      }
    });
  }, [currentReel, isPlaying]);

  return (
    <div className="h-[calc(100vh-140px)] relative overflow-hidden">
      {/* Reels Container */}
      <div 
        ref={scrollContainerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reels.map((reel, index) => (
          <div key={reel.id} className="h-full snap-start relative flex-shrink-0">
            <Card className="h-full rounded-none border-0">
              <CardContent className="p-0 h-full relative bg-gradient-to-b from-gray-900 to-black">
                {/* Video Content or Placeholder */}
                {reel.videoUrl ? (
                  <video
                    ref={el => videoRefs.current[index] = el}
                    className="w-full h-full object-cover"
                    src={reel.videoUrl}
                    loop
                    playsInline
                    muted={isMuted}
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60">
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <div className="text-center text-white">
                        <Play className="w-16 h-16 mx-auto mb-2 opacity-60" />
                        <p className="text-sm opacity-60">Video placeholder</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Video Controls */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-black/20 text-white hover:bg-black/40"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-black/20 text-white hover:bg-black/40"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Content Info */}
                <div className="absolute bottom-0 left-0 right-20 p-4 text-white">
                  <Badge variant="secondary" className="mb-2 bg-white/20 text-white">
                    {reel.category}
                  </Badge>
                  <h3 className="text-lg font-bold mb-2">{reel.title}</h3>
                  <p className="text-sm opacity-90 mb-2 line-clamp-3">
                    {reel.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs opacity-80">
                    <span>{reel.duration}</span>
                    <span>{reel.likes.toLocaleString()} likes</span>
                    <span>{reel.shares} shares</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute bottom-4 right-4 flex flex-col space-y-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-black/20 text-white hover:bg-black/40 p-3 rounded-full"
                    onClick={() => handleLike(reel.id)}
                  >
                    <Heart 
                      className={`w-5 h-5 ${reel.isLiked ? 'fill-red-500 text-red-500' : ''}`} 
                    />
                  </Button>
                  <div className="text-center">
                    <p className="text-xs text-white font-medium">
                      {reel.likes > 999 ? `${(reel.likes / 1000).toFixed(1)}k` : reel.likes}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-black/20 text-white hover:bg-black/40 p-3 rounded-full"
                    onClick={() => handleShare(reel)}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-black/20 text-white hover:bg-black/40 p-3 rounded-full"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-black/20 text-white hover:bg-black/40 p-3 rounded-full"
                    onClick={() => handleBookmark(reel.id)}
                  >
                    <Bookmark 
                      className={`w-5 h-5 ${reel.isBookmarked ? 'fill-white' : ''}`} 
                    />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
        <Button
          size="sm"
          variant="ghost"
          className="bg-black/20 text-white hover:bg-black/40 p-2 rounded-full"
          onClick={() => scrollToReel('up')}
          disabled={currentReel === 0}
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="bg-black/20 text-white hover:bg-black/40 p-2 rounded-full"
          onClick={() => scrollToReel('down')}
          disabled={currentReel === reels.length - 1}
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1">
        {reels.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-8 rounded-full transition-all duration-300 ${
              index === currentReel ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Reels;