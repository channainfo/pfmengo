"use client";

import { useState, useRef } from "react";
import { CameraIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  disabled?: boolean;
}

export default function PhotoUpload({ 
  photos, 
  onPhotosChange, 
  maxPhotos = 6, 
  disabled = false 
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newPhotos = [...photos];

    for (let i = 0; i < files.length && newPhotos.length < maxPhotos; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files');
        continue;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select images smaller than 5MB');
        continue;
      }

      try {
        // Create a preview URL (in a real app, you'd upload to a server)
        const previewUrl = URL.createObjectURL(file);
        newPhotos.push(previewUrl);
        
        // In a real implementation, you would upload to your backend here:
        // const formData = new FormData();
        // formData.append('photo', file);
        // const response = await fetch('/api/v1/profiles/media', {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   },
        //   body: formData
        // });
        // const data = await response.json();
        // newPhotos.push(data.url);
      } catch (error) {
        console.error('Error uploading photo:', error);
        alert('Failed to upload photo. Please try again.');
      }
    }

    onPhotosChange(newPhotos);
    setUploading(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const reorderPhotos = (fromIndex: number, toIndex: number) => {
    const newPhotos = [...photos];
    const [movedPhoto] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, movedPhoto);
    onPhotosChange(newPhotos);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Existing Photos */}
        {photos.map((photo, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group"
          >
            <img 
              src={photo} 
              alt={`Photo ${index + 1}`} 
              className="w-full h-full object-cover" 
            />
            
            {/* Main Photo Badge */}
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                Main
              </div>
            )}
            
            {/* Remove Button */}
            {!disabled && (
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
            
            {/* Photo Number */}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {index + 1}
            </div>
          </motion.div>
        ))}
        
        {/* Add Photo Button */}
        {!disabled && photos.length < maxPhotos && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-purple-400 hover:text-purple-600 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            ) : (
              <>
                <CameraIcon className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Add Photo</span>
                <span className="text-xs text-gray-400">{photos.length}/{maxPhotos}</span>
              </>
            )}
          </motion.button>
        )}
      </div>
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Photo Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Photo Guidelines</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Add at least 3-4 photos for better matches</li>
          <li>• Your first photo will be your main profile picture</li>
          <li>• Include a clear face photo and full body photo</li>
          <li>• Show your interests and hobbies</li>
          <li>• Use recent photos that represent you well</li>
          <li>• Maximum file size: 5MB per photo</li>
        </ul>
      </div>
      
      {/* Photo Count Warning */}
      {photos.length < 2 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <p className="text-orange-800 text-sm">
            <strong>Tip:</strong> Profiles with more photos get 3x more matches! Add {2 - photos.length} more photo{photos.length === 1 ? '' : 's'} to improve your visibility.
          </p>
        </div>
      )}
    </div>
  );
}