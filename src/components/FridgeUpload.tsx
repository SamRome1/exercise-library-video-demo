import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FridgeUploadProps {
  onUpload: (file: File) => void;
}

const FridgeUpload = ({ onUpload }: FridgeUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

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

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    onUpload(file);
    toast.success("Fridge image uploaded!");
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-fade-in">
      <div className="w-full max-w-md mx-6 pointer-events-auto">
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

          <div className="p-12 text-center space-y-6">
            {preview ? (
              <div className="space-y-4">
                <img
                  src={preview}
                  alt="Fridge preview"
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
                    <div className="relative bg-primary/10 p-6 rounded-full">
                      <Upload className="w-12 h-12 text-foreground" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    Upload your fridge photo
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop or click to browse
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ImageIcon className="w-4 h-4" />
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
