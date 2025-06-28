"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  UserIcon,
  SparklesIcon,
  HeartIcon,
  StarIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import PhotoUpload from "./PhotoUpload";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { updateProfileAsync } from "../lib/features/profile/profileSlice";

// Types
interface ProfileWizardData {
  bio?: string;
  age?: number;
  interests: string[];
  location?: string;
  city?: string;
  country?: string;
  photos: string[];
  // Tier-specific fields
  sparkProfile?: {
    lookingFor: string;
    availability: string;
    activities: string[];
  };
  connectProfile?: {
    relationshipGoals: string;
    values: string[];
    lifestyle: string;
    education?: string;
    profession?: string;
  };
  foreverProfile?: {
    marriageTimeline: string;
    familyPlans: string;
    religiousViews?: string;
    financialGoals: string;
    livingPreferences: string;
  };
}

interface LocationSuggestion {
  id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
}

interface UserLocation {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  accuracy?: number;
}

interface ProfileWizardProps {
  userTier: 'spark' | 'connect' | 'forever';
  onComplete: () => void;
  onCancel: () => void;
  initialData?: Partial<ProfileWizardData>;
  currentStep?: number;
  onNextStep?: () => void;
  onPrevStep?: () => void;
  onGoToStep?: (step: number) => void;
}

// Validation schemas - More flexible for wizard (allows saving partial data)
const baseSchema = yup.object({
  bio: yup.string().max(500, "Bio must be less than 500 characters"),
  age: yup.number().nullable().transform(value => (isNaN(value) ? null : value))
    .min(18, "Must be at least 18 years old").max(100, "Invalid age"),
  interests: yup.array().of(yup.string()),
});

const locationSchema = yup.object({
  city: yup.string(), // Not required in wizard - allow saving partial location data
});

const sparkTierSchema = yup.object({
  sparkProfile: yup.object({
    lookingFor: yup.string(),
    availability: yup.string(),
    activities: yup.array().of(yup.string()),
  }).nullable(),
});

const connectTierSchema = yup.object({
  connectProfile: yup.object({
    relationshipGoals: yup.string(),
    values: yup.array().of(yup.string()),
    lifestyle: yup.string(),
    education: yup.string(),
    profession: yup.string(),
  }).nullable(),
});

const foreverTierSchema = yup.object({
  foreverProfile: yup.object({
    marriageTimeline: yup.string(),
    familyPlans: yup.string(),
    religiousViews: yup.string(),
    financialGoals: yup.string(),
    livingPreferences: yup.string(),
  }).nullable(),
});

const photosSchema = yup.object({
  photos: yup.array().of(yup.string()), // Not required in wizard - allow saving without photos
});

export default function ProfileWizard({
  userTier,
  onComplete,
  onCancel,
  initialData,
  currentStep: externalCurrentStep,
  onNextStep,
  onPrevStep,
  onGoToStep,
}: ProfileWizardProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.profile);
  
  // Step management - use external step if provided, otherwise use internal state
  const [internalCurrentStep, setInternalCurrentStep] = useState(1);
  const currentStep = externalCurrentStep ?? internalCurrentStep;
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [actuallyCompletedSteps, setActuallyCompletedSteps] = useState<number[]>([]); // Track steps that were completed, not skipped
  const totalSteps = 4;

  // Form state for all steps
  const [wizardData, setWizardData] = useState<ProfileWizardData>({
    bio: initialData?.bio || '',
    age: initialData?.age || undefined,
    interests: initialData?.interests || [],
    location: initialData?.location || '',
    city: initialData?.city || '',
    country: initialData?.country || '',
    photos: initialData?.photos || [],
    [userTier + 'Profile']: initialData?.[userTier + 'Profile' as keyof ProfileWizardData] || {},
  });

  // Step-specific state
  const [newInterest, setNewInterest] = useState("");
  const [newActivity, setNewActivity] = useState("");
  const [newValue, setNewValue] = useState("");

  // Location state
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(null);
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingCurrentLocation, setLoadingCurrentLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Photos state
  const [photos, setPhotos] = useState<string[]>(initialData?.photos || []);

  // Step-specific loading states
  const [stepLoading, setStepLoading] = useState(false);

  // Tier configuration
  const tierConfig = {
    spark: {
      name: 'Spark',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      accentColor: 'orange',
      icon: SparklesIcon,
    },
    connect: {
      name: 'Connect',
      color: 'from-blue-500 to-purple-500',
      bgColor: 'from-blue-50 to-purple-50',
      accentColor: 'blue',
      icon: HeartIcon,
    },
    forever: {
      name: 'Forever',
      color: 'from-purple-600 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50',
      accentColor: 'purple',
      icon: StarIcon,
    },
  };

  const currentTier = tierConfig[userTier];

  // Get appropriate schema for current step
  const getStepSchema = (step: number) => {
    switch (step) {
      case 1:
        return baseSchema;
      case 2:
        return locationSchema;
      case 3:
        return userTier === 'spark' ? sparkTierSchema : userTier === 'connect' ? connectTierSchema : foreverTierSchema;
      case 4:
        return photosSchema;
      default:
        return baseSchema;
    }
  };

  // Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
    reset,
  } = useForm<ProfileWizardData>({
    resolver: yupResolver(getStepSchema(currentStep)),
    defaultValues: wizardData,
  });

  // Update form when wizardData changes
  useEffect(() => {
    reset(wizardData);
  }, [wizardData, reset]);

  // Initialize wizard step when component mounts or current step changes
  useEffect(() => {
    if (initialData && currentStep > (initialData.wizardStep || 0)) {
      // User is accessing a step beyond their saved progress, update their wizardStep
      dispatch(updateProfileAsync({ wizardStep: currentStep }));
    }
  }, [currentStep, initialData, dispatch]);

  // Location search effect
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      await searchLocations(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Update photos in wizard data
  useEffect(() => {
    setWizardData(prev => ({ ...prev, photos }));
    setValue('photos', photos);
  }, [photos, setValue]);

  // Location functions
  const searchLocations = async (query: string) => {
    setLoadingSearch(true);
    setLocationError("");
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search locations');
      }
      
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Location search error:', error);
      setLocationError('Failed to search locations. Please try again.');
    } finally {
      setLoadingSearch(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setLoadingCurrentLocation(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          
          if (!response.ok) {
            throw new Error('Failed to get address');
          }
          
          const data = await response.json();
          const address = data.display_name;
          const city = data.address?.city || data.address?.town || data.address?.village || '';
          const country = data.address?.country || '';
          
          setCurrentLocation({
            latitude,
            longitude,
            address,
            city,
            country,
            accuracy,
          });
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          setCurrentLocation({
            latitude,
            longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            city: '',
            country: '',
            accuracy,
          });
        } finally {
          setLoadingCurrentLocation(false);
        }
      },
      (error) => {
        setLoadingCurrentLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred while retrieving location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const selectSuggestion = (suggestion: LocationSuggestion) => {
    const location: UserLocation = {
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
      address: suggestion.display_name,
      city: suggestion.display_name.split(',')[0],
      country: suggestion.display_name.split(',').pop()?.trim() || '',
    };
    
    setSelectedLocation(location);
    setWizardData(prev => ({
      ...prev,
      location: location.city,
      city: location.city,
      country: location.country,
    }));
    setValue('city', location.city);
    setSuggestions([]);
    setSearchQuery('');
  };

  const selectCurrentLocation = () => {
    if (currentLocation) {
      setSelectedLocation(currentLocation);
      setWizardData(prev => ({
        ...prev,
        location: currentLocation.city,
        city: currentLocation.city,
        country: currentLocation.country,
      }));
      setValue('city', currentLocation.city);
    }
  };

  // Helper functions for managing dynamic arrays
  const addInterest = () => {
    if (newInterest.trim() && !wizardData.interests.includes(newInterest.trim())) {
      const updated = [...wizardData.interests, newInterest.trim()];
      setWizardData(prev => ({ ...prev, interests: updated }));
      setValue('interests', updated);
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    const updated = wizardData.interests.filter(i => i !== interest);
    setWizardData(prev => ({ ...prev, interests: updated }));
    setValue('interests', updated);
  };

  const addActivity = () => {
    if (newActivity.trim() && userTier === 'spark') {
      const currentActivities = (wizardData.sparkProfile?.activities || []);
      if (!currentActivities.includes(newActivity.trim())) {
        const updated = [...currentActivities, newActivity.trim()];
        const updatedSparkProfile = { ...wizardData.sparkProfile, activities: updated };
        setWizardData(prev => ({ ...prev, sparkProfile: updatedSparkProfile }));
        setValue('sparkProfile.activities', updated);
        setNewActivity("");
      }
    }
  };

  const removeActivity = (activity: string) => {
    if (userTier === 'spark') {
      const updated = (wizardData.sparkProfile?.activities || []).filter(a => a !== activity);
      const updatedSparkProfile = { ...wizardData.sparkProfile, activities: updated };
      setWizardData(prev => ({ ...prev, sparkProfile: updatedSparkProfile }));
      setValue('sparkProfile.activities', updated);
    }
  };

  const addValue = () => {
    if (newValue.trim() && userTier === 'connect') {
      const currentValues = (wizardData.connectProfile?.values || []);
      if (!currentValues.includes(newValue.trim())) {
        const updated = [...currentValues, newValue.trim()];
        const updatedConnectProfile = { ...wizardData.connectProfile, values: updated };
        setWizardData(prev => ({ ...prev, connectProfile: updatedConnectProfile }));
        setValue('connectProfile.values', updated);
        setNewValue("");
      }
    }
  };

  const removeValue = (value: string) => {
    if (userTier === 'connect') {
      const updated = (wizardData.connectProfile?.values || []).filter(v => v !== value);
      const updatedConnectProfile = { ...wizardData.connectProfile, values: updated };
      setWizardData(prev => ({ ...prev, connectProfile: updatedConnectProfile }));
      setValue('connectProfile.values', updated);
    }
  };

  // Manual save function that bypasses validation
  const saveAndContinue = async () => {
    setStepLoading(true);
    
    try {
      // Get current form values directly
      const currentValues = watch();
      
      // Update wizard data with current form values
      setWizardData(prev => ({ ...prev, ...currentValues }));

      // Save step data to backend
      await saveStepData(currentValues);

      // Mark step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      
      // Mark step as actually completed (not skipped)
      if (!actuallyCompletedSteps.includes(currentStep)) {
        setActuallyCompletedSteps(prev => [...prev, currentStep]);
      }

      // Move to next step
      if (currentStep < totalSteps) {
        if (onNextStep) {
          onNextStep(); // Use external navigation
        } else {
          setInternalCurrentStep(currentStep + 1); // Fallback to internal state
        }
      } else {
        // Final step - complete wizard only if user actually completed steps
        // Check if user completed at least 3 out of 4 steps (or all 4)
        const newActuallyCompleted = actuallyCompletedSteps.includes(currentStep) ? 
          actuallyCompletedSteps : [...actuallyCompletedSteps, currentStep];
        
        if (newActuallyCompleted.length >= 3) {
          onComplete(); // User genuinely completed the wizard
        } else {
          onCancel(); // User mostly skipped, don't mark as completed
        }
      }
    } catch (error) {
      console.error('Error saving step data:', error);
    } finally {
      setStepLoading(false);
    }
  };


  const prevStep = () => {
    if (currentStep > 1) {
      if (onPrevStep) {
        onPrevStep(); // Use external navigation
      } else {
        setInternalCurrentStep(currentStep - 1); // Fallback to internal state
      }
    }
  };

  const skipStep = async () => {
    setStepLoading(true);
    
    try {
      // Mark step as completed (even though skipped) for UI purposes
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      
      // Note: Don't add to actuallyCompletedSteps since this was skipped

      // Move to next step
      if (currentStep < totalSteps) {
        if (onNextStep) {
          onNextStep(); // Use external navigation
        } else {
          setInternalCurrentStep(currentStep + 1); // Fallback to internal state
        }
      } else {
        // Final step - check if user actually completed enough steps
        if (actuallyCompletedSteps.length >= 3) {
          onComplete(); // User completed enough steps
        } else {
          onCancel(); // User skipped too many steps
        }
      }
    } finally {
      setStepLoading(false);
    }
  };

  // Save step data to backend
  const saveStepData = async (data: ProfileWizardData) => {
    try {
      let updateData: any = {};

      switch (currentStep) {
        case 1:
          updateData = {
            bio: data.bio,
            age: data.age,
            interests: data.interests,
            wizardStep: currentStep,
          };
          break;
        case 2:
          updateData = {
            location: data.city,
            city: data.city,
            country: data.country,
            wizardStep: currentStep,
          };
          break;
        case 3:
          updateData = {
            [userTier + 'Profile']: data[userTier + 'Profile' as keyof ProfileWizardData],
            wizardStep: currentStep,
          };
          break;
        case 4:
          updateData = {
            photos: data.photos,
            wizardStep: currentStep,
          };
          break;
      }

      await dispatch(updateProfileAsync(updateData));
    } catch (error) {
      console.error('Error saving step data:', error);
      throw error;
    }
  };

  // Progress calculation
  const progress = ((currentStep - 1) / totalSteps) * 100;

  // Step content renderers
  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className={`w-16 h-16 bg-gradient-to-r ${currentTier.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <UserIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">Tell us about yourself to get started</p>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          {...register('bio')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Tell others about yourself..."
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
        )}
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Age *
        </label>
        <input
          {...register('age')}
          type="number"
          min="18"
          max="100"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Enter your age"
        />
        {errors.age && (
          <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
        )}
      </div>

      {/* Interests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interests *
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {wizardData.interests.map((interest, index) => (
            <span
              key={index}
              className={`px-3 py-1 bg-${currentTier.accentColor}-100 text-${currentTier.accentColor}-700 rounded-full text-sm flex items-center`}
            >
              {interest}
              <button
                type="button"
                onClick={() => removeInterest(interest)}
                className={`ml-2 text-${currentTier.accentColor}-500 hover:text-${currentTier.accentColor}-700`}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Add an interest"
          />
          <button
            type="button"
            onClick={addInterest}
            className={`px-4 py-2 bg-gradient-to-r ${currentTier.color} text-white rounded-lg hover:shadow-md transition-all duration-200`}
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
        {errors.interests && (
          <p className="mt-1 text-sm text-red-600">{errors.interests.message}</p>
        )}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className={`w-16 h-16 bg-gradient-to-r ${currentTier.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <MapPinIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Location</h2>
        <p className="text-gray-600">Help others find you and discover nearby matches</p>
      </div>

      {/* Error Message */}
      {locationError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
        >
          <XMarkIcon className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
          <span className="text-red-700">{locationError}</span>
        </motion.div>
      )}

      {/* Current Location Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <GlobeAltIcon className="w-5 h-5 mr-2 text-purple-600" />
          Use Current Location
        </h3>
        
        <div className="border border-gray-200 rounded-lg p-4">
          {!currentLocation ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4">
                Allow location access to automatically detect your current location
              </p>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={loadingCurrentLocation}
                className={`px-6 py-3 bg-gradient-to-r ${currentTier.color} text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none`}
              >
                {loadingCurrentLocation ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Detecting Location...
                  </div>
                ) : (
                  'Get Current Location'
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <MapPinIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{currentLocation.city}</p>
                  <p className="text-sm text-gray-600">{currentLocation.address}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={selectCurrentLocation}
                className={`px-4 py-2 bg-gradient-to-r ${currentTier.color} text-white font-medium rounded-lg hover:shadow-md transition-all duration-200`}
              >
                Use This Location
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Location Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MagnifyingGlassIcon className="w-5 h-5 mr-2 text-purple-600" />
          Search for Location
        </h3>
        
        <div className="relative">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for city, address, or place..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
            {loadingSearch && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
              </div>
            )}
          </div>
          
          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id || suggestion.display_name}
                  type="button"
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 first:rounded-t-lg last:rounded-b-lg transition-colors"
                >
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {suggestion.display_name.split(',')[0]}
                      </p>
                      <p className="text-sm text-gray-600">
                        {suggestion.display_name}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Selected Location */}
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-green-900 mb-1">
                Selected Location
              </h4>
              <p className="font-medium text-green-800">{selectedLocation.city}</p>
              <p className="text-sm text-green-700">{selectedLocation.address}</p>
            </div>
          </div>
        </motion.div>
      )}

      {errors.city && (
        <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
      )}
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className={`w-16 h-16 bg-gradient-to-r ${currentTier.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <currentTier.icon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentTier.name} Profile</h2>
        <p className="text-gray-600">Complete your {userTier} tier specific information</p>
      </div>

      {userTier === 'spark' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What are you looking for? *
            </label>
            <select
              {...register('sparkProfile.lookingFor')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="casual_dating">Casual Dating</option>
              <option value="fun_experiences">Fun Experiences</option>
              <option value="new_friends">New Friends</option>
              <option value="adventure_partner">Adventure Partner</option>
            </select>
            {errors.sparkProfile?.lookingFor && (
              <p className="mt-1 text-sm text-red-600">{errors.sparkProfile.lookingFor.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability *
            </label>
            <select
              {...register('sparkProfile.availability')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="weekends">Weekends</option>
              <option value="weeknights">Weeknights</option>
              <option value="flexible">Flexible</option>
              <option value="spontaneous">Spontaneous</option>
            </select>
            {errors.sparkProfile?.availability && (
              <p className="mt-1 text-sm text-red-600">{errors.sparkProfile.availability.message}</p>
            )}
          </div>

          {/* Activities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Favorite Activities *
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {(wizardData.sparkProfile?.activities || []).map((activity, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center"
                >
                  {activity}
                  <button
                    type="button"
                    onClick={() => removeActivity(activity)}
                    className="ml-2 text-orange-500 hover:text-orange-700"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addActivity())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Add an activity"
              />
              <button
                type="button"
                onClick={addActivity}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
            {errors.sparkProfile?.activities && (
              <p className="mt-1 text-sm text-red-600">{errors.sparkProfile.activities.message}</p>
            )}
          </div>
        </div>
      )}

      {userTier === 'connect' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship Goals *
            </label>
            <textarea
              {...register('connectProfile.relationshipGoals')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="What are you looking for in a relationship?"
            />
            {errors.connectProfile?.relationshipGoals && (
              <p className="mt-1 text-sm text-red-600">{errors.connectProfile.relationshipGoals.message}</p>
            )}
          </div>
          
          {/* Values */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Core Values *
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {(wizardData.connectProfile?.values || []).map((value, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center"
                >
                  {value}
                  <button
                    type="button"
                    onClick={() => removeValue(value)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addValue())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Add a core value"
              />
              <button
                type="button"
                onClick={addValue}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
            {errors.connectProfile?.values && (
              <p className="mt-1 text-sm text-red-600">{errors.connectProfile.values.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lifestyle *
            </label>
            <input
              {...register('connectProfile.lifestyle')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe your lifestyle"
            />
            {errors.connectProfile?.lifestyle && (
              <p className="mt-1 text-sm text-red-600">{errors.connectProfile.lifestyle.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education
            </label>
            <input
              {...register('connectProfile.education')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your education background"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profession
            </label>
            <input
              {...register('connectProfile.profession')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your profession or career"
            />
          </div>
        </div>
      )}

      {userTier === 'forever' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marriage Timeline *
            </label>
            <select
              {...register('foreverProfile.marriageTimeline')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="1_year">Within 1 year</option>
              <option value="2_years">Within 2 years</option>
              <option value="3_years">Within 3 years</option>
              <option value="open">Open to timeline</option>
            </select>
            {errors.foreverProfile?.marriageTimeline && (
              <p className="mt-1 text-sm text-red-600">{errors.foreverProfile.marriageTimeline.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Family Plans *
            </label>
            <textarea
              {...register('foreverProfile.familyPlans')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your thoughts on having children and family life"
            />
            {errors.foreverProfile?.familyPlans && (
              <p className="mt-1 text-sm text-red-600">{errors.foreverProfile.familyPlans.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Religious Views
            </label>
            <input
              {...register('foreverProfile.religiousViews')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your religious or spiritual beliefs"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Financial Goals *
            </label>
            <textarea
              {...register('foreverProfile.financialGoals')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your financial aspirations and planning approach"
            />
            {errors.foreverProfile?.financialGoals && (
              <p className="mt-1 text-sm text-red-600">{errors.foreverProfile.financialGoals.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Living Preferences *
            </label>
            <input
              {...register('foreverProfile.livingPreferences')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Where and how you'd like to live"
            />
            {errors.foreverProfile?.livingPreferences && (
              <p className="mt-1 text-sm text-red-600">{errors.foreverProfile.livingPreferences.message}</p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className={`w-16 h-16 bg-gradient-to-r ${currentTier.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <CameraIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Your Photos</h2>
        <p className="text-gray-600">Show your best self with great photos</p>
      </div>

      <PhotoUpload
        photos={photos}
        onPhotosChange={setPhotos}
        maxPhotos={6}
      />
      {errors.photos && (
        <p className="mt-1 text-sm text-red-600">{errors.photos.message}</p>
      )}
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTier.bgColor}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your {currentTier.name} Profile
          </h1>
          <p className="text-gray-600">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {Array.from({ length: totalSteps }, (_, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = completedSteps.includes(stepNumber);
              
              return (
                <div
                  key={stepNumber}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? `bg-gradient-to-r ${currentTier.color} text-white`
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    stepNumber
                  )}
                </div>
              );
            })}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`h-2 bg-gradient-to-r ${currentTier.color} rounded-full`}
            />
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
              >
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                <span className="text-red-700">{error}</span>
              </motion.div>
            )}

            <form onSubmit={(e) => e.preventDefault()}>
              {/* Show form validation errors (informational only, not blocking) */}
              {Object.keys(errors).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
                    <span className="text-yellow-700 text-sm">
                      Some fields have errors, but you can still save and continue.
                    </span>
                  </div>
                </motion.div>
              )}
              
              <AnimatePresence mode="wait">
                {renderCurrentStep()}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex gap-4 pt-8 border-t border-gray-200 mt-8"
              >
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={stepLoading}
                    className="flex items-center px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back
                  </button>
                )}

                <div className="flex-1" />

                {currentStep < totalSteps && (
                  <button
                    type="button"
                    onClick={skipStep}
                    disabled={stepLoading}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Skip
                  </button>
                )}

                <button
                  type="button"
                  onClick={saveAndContinue}
                  disabled={stepLoading || isLoading}
                  className={`flex items-center px-6 py-3 bg-gradient-to-r ${currentTier.color} text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none`}
                >
                  {stepLoading || isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : currentStep < totalSteps ? (
                    <>
                      Save & Continue
                      <ArrowRightIcon className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      Complete Profile
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </div>
        </motion.div>

        {/* Cancel Button */}
        <div className="text-center mt-6">
          <button
            onClick={onCancel}
            disabled={stepLoading || isLoading}
            className="text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel setup and return later
          </button>
        </div>
      </div>
    </div>
  );
}