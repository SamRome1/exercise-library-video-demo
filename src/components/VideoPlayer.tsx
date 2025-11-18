import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import FridgeUpload from "./FridgeUpload";

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClick = () => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowOverlay(false);
    }
  };

  const handleVideoEnd = () => {
    setShowUpload(true);
  };

  const handleUpload = (file: File, imageData: string) => {
    console.log("Uploaded file:", file.name);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-contain"
        src="/door-video.mp4"
        playsInline
        muted
        onEnded={handleVideoEnd}
      />

      {/* Interactive Overlay */}
      <div
        onClick={handleClick}
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-1000",
          showOverlay
            ? "opacity-100 cursor-pointer"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="text-center space-y-3 px-6 animate-fade-in" style={{ marginTop: '8vh' }}>
          <h1 className="text-lg md:text-xl font-medium text-foreground tracking-wide">
            Click on the door to open it
          </h1>
          <div className="flex justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
          </div>
        </div>
      </div>


      {/* Fridge Upload Component */}
      {showUpload && <FridgeUpload onUpload={handleUpload} />}
    </div>
  );
};

export default VideoPlayer;
