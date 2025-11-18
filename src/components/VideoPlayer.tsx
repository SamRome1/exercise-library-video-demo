import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClick = () => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowOverlay(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-contain"
        src="/door-video.mp4"
        playsInline
        muted={false}
      />

      {/* Interactive Overlay */}
      <div
        onClick={handleClick}
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-1000",
          showOverlay
            ? "opacity-100 cursor-pointer bg-black/60 backdrop-blur-sm"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="text-center space-y-6 px-6 animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight">
            Click on the door to open it
          </h1>
          <div className="flex justify-center">
            <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
          </div>
        </div>
      </div>

      {/* Vignette Effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-black/40" />
    </div>
  );
};

export default VideoPlayer;
