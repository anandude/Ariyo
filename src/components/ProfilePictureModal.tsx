
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, X, Move, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl?: string;
  currentPosition?: { x: number; y: number; scale: number };
  onImageUploaded: (url: string, position: { x: number; y: number; scale: number }) => void;
  onImageRemoved: () => void;
  personName: string;
}

const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({
  isOpen,
  onClose,
  currentImageUrl,
  currentPosition,
  onImageUploaded,
  onImageRemoved,
  personName
}) => {
  const [uploading, setUploading] = useState(false);
  const [showPositioning, setShowPositioning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, scale: 1 });
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const { user } = useAuth();
  const previewRef = useRef<HTMLDivElement>(null);

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
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(data.path);

      setNewImageUrl(urlData.publicUrl);
      setPosition({ x: 0, y: 0, scale: 1 });
      setShowPositioning(true);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully. Now position it as needed.",
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

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!showPositioning) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !showPositioning) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPosition(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScaleChange = (newScale: number) => {
    setPosition(prev => ({ ...prev, scale: newScale }));
  };

  const resetPosition = () => {
    setPosition({ x: 0, y: 0, scale: 1 });
  };

  const saveNewImage = () => {
    if (newImageUrl) {
      onImageUploaded(newImageUrl, position);
    }
    setShowPositioning(false);
    setNewImageUrl(null);
    onClose();
  };

  const cancelPositioning = () => {
    setShowPositioning(false);
    setNewImageUrl(null);
    setPosition({ x: 0, y: 0, scale: 1 });
  };

  const getImageStyle = () => {
    if (!showPositioning) return {};
    return {
      transform: `translate(${position.x}px, ${position.y}px) scale(${position.scale})`,
      transformOrigin: 'center',
      cursor: isDragging ? 'grabbing' : 'grab'
    };
  };

  const getCurrentImageStyle = () => {
    if (!currentPosition) return {};
    const { x, y, scale } = currentPosition;
    return {
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
      transformOrigin: 'center'
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{personName}'s Profile Picture</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Preview */}
          <div className="flex justify-center">
            <div 
              ref={previewRef}
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 relative bg-gray-100"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {showPositioning && newImageUrl ? (
                <img 
                  src={newImageUrl} 
                  alt={personName}
                  className="w-full h-full object-cover"
                  style={getImageStyle()}
                  onMouseDown={handleMouseDown}
                  draggable={false}
                />
              ) : currentImageUrl ? (
                <img 
                  src={currentImageUrl} 
                  alt={personName}
                  className="w-full h-full object-cover"
                  style={getCurrentImageStyle()}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-3xl">
                  {personName.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Positioning Controls - Only shown when uploading new image */}
          {showPositioning && newImageUrl && (
            <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Move size={16} />
                Position Your Image
              </Label>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs text-gray-600">Scale: {position.scale.toFixed(2)}</Label>
                  <Input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={position.scale}
                    onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <Button
                  onClick={resetPosition}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <RotateCcw size={16} className="mr-2" />
                  Reset Position
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Drag the image to reposition it within the circle
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={cancelPositioning}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveNewImage}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  Save
                </Button>
              </div>
            </div>
          )}

          {/* Upload/Remove Actions - Only shown when not positioning */}
          {!showPositioning && (
            <div className="space-y-3">
              <Label htmlFor="image-upload" className="cursor-pointer">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  className="w-full"
                  asChild
                >
                  <span>
                    <Upload size={16} className="mr-2" />
                    {uploading ? 'Uploading...' : currentImageUrl ? 'Update Picture' : 'Add Profile Picture'}
                  </span>
                </Button>
              </Label>

              {currentImageUrl && (
                <Button
                  onClick={() => {
                    onImageRemoved();
                    onClose();
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600 hover:text-red-700"
                >
                  <X size={16} className="mr-2" />
                  Remove Picture
                </Button>
              )}

              {!showPositioning && (
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full"
                >
                  Close
                </Button>
              )}
            </div>
          )}
        </div>
        
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePictureModal;
