import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 60) / 3;

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  disabled?: boolean;
  tierColors?: string[];
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photos,
  onPhotosChange,
  maxPhotos = 6,
  disabled = false,
  tierColors = ['#8b5cf6', '#ec4899'],
}) => {
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  
  const scaleValue = useSharedValue(1);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to upload photos!'
      );
      return false;
    }
    return true;
  };

  const handleImagePicker = async () => {
    if (disabled || uploading) return;
    
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert(
      'Select Photo',
      'Choose how you\'d like to add a photo',
      [
        {
          text: 'Camera',
          onPress: () => openCamera(),
        },
        {
          text: 'Photo Library',
          onPress: () => openImageLibrary(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const openImageLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image library error:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const processImage = async (uri: string) => {
    if (photos.length >= maxPhotos) {
      Alert.alert('Maximum Photos Reached', `You can only upload ${maxPhotos} photos`);
      return;
    }

    setUploading(true);
    
    try {
      // Resize and compress the image
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [
          { resize: { width: 800, height: 800 } }, // Resize to max 800x800
        ],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      // In a real app, you would upload to your backend here:
      // const formData = new FormData();
      // formData.append('photo', {
      //   uri: manipulatedImage.uri,
      //   type: 'image/jpeg',
      //   name: 'photo.jpg',
      // } as any);
      // const response = await uploadPhoto(formData);
      // const photoUrl = response.data.url;
      
      // For now, we'll use the local URI
      const newPhotos = [...photos, manipulatedImage.uri];
      onPhotosChange(newPhotos);
      
      // Animate button
      scaleValue.value = withSpring(1.1, {}, () => {
        scaleValue.value = withSpring(1);
      });
      
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const newPhotos = photos.filter((_, i) => i !== index);
            onPhotosChange(newPhotos);
          },
        },
      ]
    );
  };

  const movePhotoToFirst = (index: number) => {
    if (index === 0) return;
    
    Alert.alert(
      'Set as Main Photo',
      'Do you want to set this as your main profile photo?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Set as Main',
          onPress: () => {
            const newPhotos = [...photos];
            const [movedPhoto] = newPhotos.splice(index, 1);
            newPhotos.unshift(movedPhoto);
            onPhotosChange(newPhotos);
          },
        },
      ]
    );
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Photos ({photos.length}/{maxPhotos})</Text>
        <Text style={styles.subtitle}>
          Add photos to make your profile more attractive
        </Text>
      </View>

      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.photosContainer}
      >
        {/* Existing Photos */}
        {photos.map((photo, index) => (
          <Animated.View
            key={index}
            entering={FadeIn.delay(index * 100)}
            exiting={FadeOut}
            style={styles.photoContainer}
          >
            <TouchableOpacity
              onPress={() => movePhotoToFirst(index)}
              onLongPress={() => !disabled && removePhoto(index)}
              disabled={disabled}
            >
              <Image source={{ uri: photo }} style={styles.photo} />
              
              {/* Main Photo Badge */}
              {index === 0 && (
                <LinearGradient
                  colors={tierColors}
                  style={styles.mainBadge}
                >
                  <Text style={styles.mainBadgeText}>Main</Text>
                </LinearGradient>
              )}
              
              {/* Photo Number */}
              <View style={styles.photoNumber}>
                <Text style={styles.photoNumberText}>{index + 1}</Text>
              </View>
              
              {/* Remove Button */}
              {!disabled && (
                <TouchableOpacity
                  onPress={() => removePhoto(index)}
                  style={styles.removeButton}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
        
        {/* Add Photo Button */}
        {!disabled && photos.length < maxPhotos && (
          <Animated.View style={[styles.addButtonContainer, animatedButtonStyle]}>
            <TouchableOpacity
              onPress={handleImagePicker}
              disabled={uploading}
              style={styles.addButton}
            >
              {uploading ? (
                <ActivityIndicator size="small" color={tierColors[0]} />
              ) : (
                <>
                  <Ionicons name="camera" size={24} color={tierColors[0]} />
                  <Text style={[styles.addButtonText, { color: tierColors[0] }]}>
                    Add Photo
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      {/* Photo Guidelines */}
      <View style={styles.guidelines}>
        <View style={styles.guidelinesHeader}>
          <Ionicons name="information-circle" size={20} color="#3b82f6" />
          <Text style={styles.guidelinesTitle}>Photo Guidelines</Text>
        </View>
        <Text style={styles.guidelinesText}>
          • Add at least 3-4 photos for better matches{"\n"}
          • Your first photo will be your main profile picture{"\n"}
          • Include a clear face photo and full body photo{"\n"}
          • Show your interests and hobbies{"\n"}
          • Use recent photos that represent you well
        </Text>
      </View>

      {/* Photo Count Warning */}
      {photos.length < 2 && (
        <Animated.View entering={FadeIn} style={styles.warning}>
          <Ionicons name="warning" size={20} color="#f59e0b" />
          <Text style={styles.warningText}>
            Profiles with more photos get 3x more matches! Add {2 - photos.length} more photo{photos.length === 1 ? '' : 's'} to improve your visibility.
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  photosContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  photoContainer: {
    marginRight: 12,
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 12,
  },
  mainBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mainBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  photoNumber: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  photoNumberText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonContainer: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
  },
  addButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  guidelines: {
    backgroundColor: '#dbeafe',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#93c5fd',
    marginTop: 20,
  },
  guidelinesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginLeft: 6,
  },
  guidelinesText: {
    fontSize: 12,
    color: '#1e40af',
    lineHeight: 18,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fef3c7',
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fcd34d',
    marginTop: 12,
  },
  warningText: {
    fontSize: 12,
    color: '#92400e',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
});

export default PhotoUpload;