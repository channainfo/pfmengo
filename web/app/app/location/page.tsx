"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XMarkIcon,
  GlobeAltIcon,
  UserIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../../../lib/hooks";
import { fetchProfileAsync } from "../../../lib/features/profile/profileSlice";
import AuthWrapper from "../../../components/AuthWrapper";

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

export default function LocationPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { profile, isLoading } = useAppSelector((state) => state.profile);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(null);
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingCurrentLocation, setLoadingCurrentLocation] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");

  const tierConfig = {
    spark: {
      name: 'Spark',
      color: 'from-orange-500 to-red-500',
    },
    connect: {
      name: 'Connect',
      color: 'from-blue-500 to-purple-500',
    },
    forever: {
      name: 'Forever',
      color: 'from-purple-600 to-pink-600',
    },
  };

  const currentTier = tierConfig[user?.tier || 'connect'];

  useEffect(() => {
    // Set current location from profile if available
    if (profile?.city) {
      setSelectedLocation({
        latitude: 0,
        longitude: 0,
        address: profile.city,
        city: profile.city,
        country: profile.country || '',
      });
    }
  }, [profile]);

  // Debounced search for location suggestions
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

  const searchLocations = async (query: string) => {
    setLoadingSearch(true);
    setError("");
    
    try {
      // Using Nominatim (OpenStreetMap) for geocoding - free and no API key required
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
      setError('Failed to search locations. Please try again.');
    } finally {
      setLoadingSearch(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoadingCurrentLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        try {
          // Reverse geocoding to get address
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
            setError('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred while retrieving location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
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
    setSuggestions([]);
    setSearchQuery('');
  };

  const selectCurrentLocation = () => {
    if (currentLocation) {
      setSelectedLocation(currentLocation);
    }
  };

  const saveLocation = async () => {
    if (!selectedLocation) {
      setError('Please select a location first.');
      return;
    }

    setSaveLoading(true);
    setError("");

    try {
      // Get token safely (client-side only)
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      // Call the new location-specific API endpoint
      const response = await fetch('http://localhost:3000/api/v1/profiles/location', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          location: selectedLocation.city,
          city: selectedLocation.city,
          country: selectedLocation.country,
          // Store coordinates for future use
          locationData: {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            address: selectedLocation.address,
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update location');
      }
      
      // Refresh the profile data to show updated location
      await dispatch(fetchProfileAsync());
      
      // Success - redirect back to profile
      router.push('/app/profile');
    } catch (error) {
      console.error('Error saving location:', error);
      setError('Failed to save location. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const clearLocation = () => {
    setSelectedLocation(null);
    setCurrentLocation(null);
    setSearchQuery('');
    setSuggestions([]);
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => router.push('/app/profile')}
                className="flex items-center text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Profile
              </button>
              <h1 className="text-xl font-bold text-gray-900">Manage Location</h1>
              <div className="w-20" /> {/* Spacer */}
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header Section */}
            <div className={`bg-gradient-to-r ${currentTier.color} px-8 py-6`}>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                  <MapPinIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Your Location</h2>
                  <p className="text-white text-opacity-90">
                    Help others find you and discover nearby matches
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
                >
                  <XMarkIcon className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                  <span className="text-red-700">{error}</span>
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
                          {currentLocation.accuracy && (
                            <p className="text-xs text-gray-500">
                              Accuracy: ±{Math.round(currentLocation.accuracy)}m
                            </p>
                          )}
                        </div>
                      </div>
                      <button
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

              {/* Selected Location Section */}
              {selectedLocation && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center justify-between">
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
                        <p className="text-xs text-green-600 mt-1">
                          {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearLocation}
                      className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Privacy Notice */}
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <UserIcon className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Privacy & Safety</h4>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      Your exact location is never shared with other users. We only show your general city/area to help you find nearby matches. You can update or remove your location at any time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/app/profile')}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveLocation}
                  disabled={!selectedLocation || saveLoading}
                  className={`flex-1 py-3 px-4 bg-gradient-to-r ${currentTier.color} text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none`}
                >
                  {saveLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    'Save Location'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AuthWrapper>
  );
}