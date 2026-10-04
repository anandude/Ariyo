
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image } from 'lucide-react';
import { authClient } from '@/integrations/neon/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const FUNCTION_URL = import.meta.env.VITE_NEON_FUNCTION_URL as string | undefined;

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  currentImageUrl, 
  onImageUploaded, 
  onImageRemoved 
}) => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const uploadImage = async (file: File) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload images",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    try {
      if (!FUNCTION_URL) {
        throw new Error("VITE_NEON_FUNCTION_URL is not configured");
      }

      // 1. Mint a short-lived JWT for the upload function
      const { data: tokenData } = await authClient.token();
      const token = tokenData?.token;
      if (!token) {
        throw new Error("Not authenticated");
      }

      // 2. Ask the Neon function for a presigned upload URL
      const presignRes = await fetch(`${FUNCTION_URL}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      if (!presignRes.ok) {
        throw new Error(`Presign request failed (${presignRes.status})`);
      }
      const { uploadUrl, publicUrl } = await presignRes.json();

      // 3. PUT the file bytes directly to object storage
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) {
        throw new Error(`Upload failed (${putRes.status})`);
      }

      // 4. Store the public URL as the person's image_url
      onImageUploaded(publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    uploadImage(file);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Image size={16} />
        Profile Picture
      </Label>
      
      {currentImageUrl ? (
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
            <img 
              src={currentImageUrl} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={onImageRemoved}
              variant="outline"
              size="sm"
              className="w-fit"
            >
              <X size={16} className="mr-1" />
              Remove
            </Button>
            <Label htmlFor="image-upload" className="cursor-pointer">
              <Button
                variant="outline"
                size="sm"
                disabled={uploading}
                asChild
              >
                <span>
                  <Upload size={16} className="mr-1" />
                  {uploading ? 'Uploading...' : 'Change'}
                </span>
              </Button>
            </Label>
          </div>
        </div>
      ) : (
        <Label htmlFor="image-upload" className="cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <Button
                  variant="outline"
                  disabled={uploading}
                  asChild
                >
                  <span>
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </span>
                </Button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
        </Label>
      )}
      
      <Input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
