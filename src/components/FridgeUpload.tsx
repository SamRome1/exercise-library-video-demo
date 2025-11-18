import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface FridgeUploadProps {
  onUpload: (file: File, imageData: string) => void;
}

const FridgeUpload = ({ onUpload }: FridgeUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleFile(file);
      } else {
        toast.error("Please upload an image file");
      }
    },
    [onUpload]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [onUpload]
  );

  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      setPreview(imageData);
      setIsAnalyzing(true);

      try {
        // Call AI to analyze the machine
        const { data, error } = await supabase.functions.invoke('analyze-machine', {
          body: { imageBase64: imageData }
        });

        if (error) throw error;

        // Save to database
        const { error: insertError } = await supabase
          .from('machines')
          .insert({
            name: data.name,
            muscles: data.muscles,
            image_url: imageData
          });

        if (insertError) throw insertError;

        toast.success(`${data.name} detected! Added to your workout list.`);
        
        // Navigate to workout list after a short delay
        setTimeout(() => {
          navigate('/workout-list');
        }, 1500);

      } catch (error) {
        console.error('Error analyzing machine:', error);
        toast.error('Failed to analyze machine. Please try again.');
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
    onUpload(file, '');
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-fade-in">
      <div className="w-full max-w-xs mx-6 pointer-events-auto" style={{ marginLeft: '-5%' }}>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative rounded-2xl border-2 border-dashed transition-all duration-300",
            "bg-background/40 backdrop-blur-xl shadow-2xl",
            isDragging
              ? "border-primary bg-primary/10 scale-105"
              : "border-border/50 hover:border-primary/50"
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          <div className="p-8 text-center space-y-4">
            {isAnalyzing ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Loader2 className="w-12 h-12 text-foreground animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Analyzing machine...
                </h3>
                <p className="text-xs text-muted-foreground">
                  Our AI is identifying the machine and muscle groups
                </p>
              </div>
            ) : preview ? (
              <div className="space-y-4">
                <img
                  src={preview}
                  alt="Machine preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-sm text-muted-foreground">
                  Click to change image
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                    <div className="relative bg-primary/10 p-4 rounded-full">
                      <Upload className="w-8 h-8 text-foreground" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Upload machine photo
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Drag and drop or click to browse
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ImageIcon className="w-3 h-3" />
                  <span>JPG, PNG, WEBP up to 20MB</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FridgeUpload;
