/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  UserIcon,
  CameraIcon,
  PencilIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  HeartIcon,
  UserGroupIcon,
  MapPinIcon,
  CalendarIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../../../lib/hooks";
import { fetchProfileAsync, updateProfileAsync } from "../../../lib/features/profile/profileSlice";
import { isProfileComplete, getProfileCompleteness } from "../../../lib/utils/profileUtils";
import { useAuthReady } from "../../../lib/hooks/useAuthReady";

interface ProfileData {
  id: string;
  userId: string;
  bio?: string;
  age: number;
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  interests: string[];
  photos: string[];
  isComplete: boolean;
  wizardStep: number;
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

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { profile, isLoading } = useAppSelector((state) => state.profile);
  const { user, isAuthReady } = useAuthReady();
  const [activeTab, setActiveTab] = useState<'basic' | 'tier' | 'location' | 'photos'>('basic');
  const [saveLoading, setSaveLoading] = useState<Record<string, boolean>>({});
  const [hasCheckedRedirect, setHasCheckedRedirect] = useState(false);
  const [hasFetchedProfile, setHasFetchedProfile] = useState(false);

  useEffect(() => {
    // Fetch profile only when auth is ready and we have a user
    if (isAuthReady && user && !hasFetchedProfile) {
      dispatch(fetchProfileAsync());
      setHasFetchedProfile(true);
    }
  }, [dispatch, user, hasFetchedProfile, isAuthReady]);


  useEffect(() => {
    // Check if user should be redirected to wizard
    // Only check once when we have all the data
    if (!isLoading && user && profile !== undefined && !hasCheckedRedirect) {
      const profileComplete = isProfileComplete(profile);

      // If profile is incomplete, redirect to wizard at the next step
      if (!profileComplete) {
        const step = Math.max(1, (profile?.wizardStep || 0) + 1);
        router.push(`/app/profile/wizard?step=${step}&auto=true`);
        return;
      }

      setHasCheckedRedirect(true);
    }
  }, [profile, isLoading, user, router, hasCheckedRedirect]);


  const tierConfig = {
    spark: {
      name: 'Spark',
      color: 'from-orange-500 to-red-500',
      icon: SparklesIcon,
    },
    connect: {
      name: 'Connect',
      color: 'from-blue-500 to-purple-500',
      icon: HeartIcon,
    },
    forever: {
      name: 'Forever',
      color: 'from-purple-600 to-pink-600',
      icon: UserGroupIcon,
    }
  };


  // Wait for auth to be ready before making any decisions
  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Auth is ready but no user - AuthWrapper will redirect
  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const currentTier = tierConfig[user.tier || 'connect'];
  const TierIcon = currentTier.icon;

  // Calculate profile completeness using wizard step
  const completeness = getProfileCompleteness(profile).percentage;

  const handleSaveTab = async (tabName: string, formData: any) => {
    setSaveLoading(prev => ({ ...prev, [tabName]: true }));
    try {
      await dispatch(updateProfileAsync(formData)).unwrap();
      // Show success message
    } catch (error) {
      console.error(`Error saving ${tabName}:`, error);
      // Show error message
    } finally {
      setSaveLoading(prev => ({ ...prev, [tabName]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => router.push('/app/dashboard')}
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  ← Back to Dashboard
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentTier.color} p-1.5`}>
                    <TierIcon className="w-full h-full text-white" />
                  </div>
                  <span className="font-medium">{currentTier.name}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6">
                {/* Profile Photo */}
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {profile?.photos && profile.photos.length > 0 ? (
                      <img
                        src={profile.photos[0]}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors">
                    <CameraIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Basic Info */}
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    {profile?.age && (
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{profile.age} years old</span>
                      </div>
                    )}
                    {profile?.city && (
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{profile.city}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/app/profile/wizard?step=1')}
                  className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 border-2 border-purple-500 text-purple-600 hover:bg-purple-50"
                  title="Use the guided setup wizard to complete or update your profile"
                >
                  <SparklesIcon className="w-5 h-5 inline mr-2" />
                  {isProfileComplete(profile) ? 'Update via Wizard' : 'Setup Wizard'}
                </button>

                {/* Reset Wizard button for testing - can be removed in production */}
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={async () => {
                      // Reset wizardStep to 0 in database
                      await dispatch(updateProfileAsync({ wizardStep: 0 }));
                      window.location.reload();
                    }}
                    className="px-4 py-2 text-xs rounded-lg font-medium transition-all duration-200 border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Reset Wizard
                  </button>
                )}
              </div>
            </div>

            {/* Profile Completeness */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
                <span className="text-sm font-bold text-purple-600">{completeness}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${currentTier.color} transition-all duration-500`}
                  style={{ width: `${completeness}%` }}
                ></div>
              </div>
              {completeness < 80 && (
                <div className="flex items-center mt-2 text-orange-600">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  <span className="text-xs">Complete your profile to get better matches</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {profile?.bio && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">About Me</h3>
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Interests */}
            {profile?.interests && profile.interests.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${currentTier.color} text-white`}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Profile Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8 pt-6">
                {[
                  { id: 'basic', label: 'Basic Info' },
                  { id: 'tier', label: `${currentTier.name} Profile` },
                  { id: 'location', label: 'Location' },
                  { id: 'photos', label: 'Photos' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'basic' && (
                <BasicInfoTab
                  profile={profile}
                  onSave={(data) => handleSaveTab('basic', data)}
                  isLoading={saveLoading.basic || false}
                />
              )}

              {activeTab === 'tier' && (
                <TierProfileTab
                  profile={profile}
                  userTier={user?.tier || 'connect'}
                  onSave={(data) => handleSaveTab('tier', data)}
                  isLoading={saveLoading.tier || false}
                />
              )}

              {activeTab === 'location' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center">
                      <MapPinIcon className="w-6 h-6 mr-2 text-purple-600" />
                      Your Location
                    </h3>
                    <button
                      onClick={() => {
                        console.log('Manage Location button clicked');
                        router.push('/app/location');
                      }}
                      className={`px-4 py-2 bg-gradient-to-r ${currentTier.color} text-white font-medium rounded-lg hover:shadow-md transition-all duration-200 flex items-center`}
                    >
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Manage Location
                    </button>
                  </div>

                  {profile?.city ? (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                          <MapPinIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-green-900 mb-1">
                            Current Location
                          </h4>
                          <p className="font-medium text-green-800">{profile.city}</p>
                          {profile.country && (
                            <p className="text-sm text-green-700">{profile.country}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPinIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">No Location Set</h4>
                      <p className="text-gray-600 mb-4 max-w-md mx-auto">
                        Add your location to help others find you nearby and discover local matches.
                      </p>
                      <button
                        onClick={() => {
                          console.log('Add Your Location button clicked');
                          router.push('/app/location');
                        }}
                        className={`px-6 py-3 bg-gradient-to-r ${currentTier.color} text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                      >
                        Add Your Location
                      </button>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">Location Benefits</h4>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
                        Get matched with people nearby
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
                        Discover local events and activities
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
                        Find connections in your area
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
                        Enable location-based features
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'photos' && (
                <PhotosTab
                  profile={profile}
                  onSave={(data) => handleSaveTab('photos', data)}
                  isLoading={saveLoading.photos || false}
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
  );
}

// Individual Tab Components
function BasicInfoTab({ profile, onSave, isLoading }: { profile: ProfileData | null, onSave: (data: any) => void, isLoading: boolean }) {
  const [bio, setBio] = useState(profile?.bio || '');
  const [age, setAge] = useState(profile?.age?.toString() || '');
  const [interests, setInterests] = useState<string[]>(profile?.interests || []);
  const [newInterest, setNewInterest] = useState('');

  // Update state when profile loads
  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setAge(profile.age?.toString() || '');
      setInterests(profile.interests || []);
    }
  }, [profile]);

  const handleSave = () => {
    onSave({
      bio: bio.trim(),
      age: age ? parseInt(age.toString()) : null,
      interests
    });
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Basic Information</h3>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Tell others about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Age
        </label>
        <input
          type="number"
          min="18"
          max="100"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Your age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interests
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {interests.map((interest, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center"
            >
              {interest}
              <button
                onClick={() => removeInterest(index)}
                className="ml-2 text-purple-500 hover:text-purple-700"
              >
                ×
              </button>
            </span>
          ))}
          {interests.length === 0 && (
            <p className="text-gray-500 text-sm">No interests added yet</p>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Add interests (press Enter to add)"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={addInterest}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TierProfileTab({ profile, userTier, onSave, isLoading }: { profile: ProfileData | null, userTier: string, onSave: (data: any) => void, isLoading: boolean }) {
  const [tierData, setTierData] = useState<any>(() => {
    if (userTier === 'spark') return profile?.sparkProfile || {};
    if (userTier === 'connect') return profile?.connectProfile || {};
    if (userTier === 'forever') return profile?.foreverProfile || {};
    return {};
  });

  // Update state when profile loads
  useEffect(() => {
    if (profile) {
      if (userTier === 'spark') setTierData(profile.sparkProfile || {});
      else if (userTier === 'connect') setTierData(profile.connectProfile || {});
      else if (userTier === 'forever') setTierData(profile.foreverProfile || {});
    }
  }, [profile, userTier]);

  const handleSave = () => {
    const saveData = {
      [`${userTier}Profile`]: tierData
    };
    onSave(saveData);
  };

  const updateField = (field: string, value: any) => {
    setTierData((prev: any) => ({ ...prev, [field]: value }));
  };

  const tierConfig = {
    spark: {
      name: 'Spark',
      color: 'from-orange-500 to-red-500',
      icon: SparklesIcon,
    },
    connect: {
      name: 'Connect',
      color: 'from-blue-500 to-purple-500',
      icon: HeartIcon,
    },
    forever: {
      name: 'Forever',
      color: 'from-purple-600 to-pink-600',
      icon: UserGroupIcon,
    }
  };

  const currentTier = tierConfig[userTier as keyof typeof tierConfig];
  const TierIcon = currentTier.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentTier.color} p-2`}>
            <TierIcon className="w-full h-full text-white" />
          </div>
          <h3 className="text-xl font-bold">{currentTier.name} Profile</h3>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {userTier === 'spark' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What are you looking for?
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={tierData.lookingFor || ''}
              onChange={(e) => updateField('lookingFor', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="casual_dating">Casual Dating</option>
              <option value="fun_experiences">Fun Experiences</option>
              <option value="new_friends">New Friends</option>
              <option value="adventure_partner">Adventure Partner</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={tierData.availability || ''}
              onChange={(e) => updateField('availability', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="weekends">Weekends</option>
              <option value="weeknights">Weeknights</option>
              <option value="flexible">Flexible</option>
              <option value="spontaneous">Spontaneous</option>
            </select>
          </div>
        </div>
      )}

      {userTier === 'connect' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship Goals
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="What are you looking for in a relationship?"
              value={tierData.relationshipGoals || ''}
              onChange={(e) => updateField('relationshipGoals', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your education background"
              value={tierData.education || ''}
              onChange={(e) => updateField('education', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profession
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your profession or career"
              value={tierData.profession || ''}
              onChange={(e) => updateField('profession', e.target.value)}
            />
          </div>
        </div>
      )}

      {userTier === 'forever' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marriage Timeline
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={tierData.marriageTimeline || ''}
              onChange={(e) => updateField('marriageTimeline', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="1_year">Within 1 year</option>
              <option value="2_years">Within 2 years</option>
              <option value="3_years">Within 3 years</option>
              <option value="open">Open to timeline</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Family Plans
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your thoughts on having children and family life"
              value={tierData.familyPlans || ''}
              onChange={(e) => updateField('familyPlans', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Financial Goals
            </label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your financial aspirations and planning approach"
              value={tierData.financialGoals || ''}
              onChange={(e) => updateField('financialGoals', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function PhotosTab({ profile, onSave, isLoading }: { profile: ProfileData | null, onSave: (data: any) => void, isLoading: boolean }) {
  const [photos, setPhotos] = useState<string[]>(profile?.photos || []);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update state when profile loads
  useEffect(() => {
    if (profile) {
      setPhotos(profile.photos || []);
    }
  }, [profile]);

  const handleSave = async () => {
    // For now, let's save photos as part of basic profile
    // In a future iteration, we could use the /media endpoint
    onSave({ photos });
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleAddPhoto = () => {
    if (photos.length >= 6) {
      alert('You can upload a maximum of 6 photos');
      return;
    }
    if (isProcessing) {
      return;
    }
    fileInputRef.current?.click();
  };

  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = height * (maxWidth / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = width * (maxHeight / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to base64 with higher compression to reduce size
          const base64 = canvas.toDataURL('image/jpeg', 0.5);
          resolve(base64);
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }
    
    setIsProcessing(true);
    try {
      // Resize image to max 800x800 pixels
      const resizedBase64 = await resizeImage(file, 800, 800);
      setPhotos([...photos, resizedBase64]);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try another file.');
    } finally {
      setIsProcessing(false);
    }
    
    // Reset input to allow selecting the same file again
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">Photo Gallery</h3>
          <p className="text-sm text-gray-600">{photos.length} of 6 photos uploaded</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => removePhoto(index)}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ))}
        {photos.length === 0 && (
          <p className="text-gray-500 text-sm col-span-full">No photos uploaded yet</p>
        )}

        {photos.length < 6 && (
          <button 
            onClick={handleAddPhoto}
            disabled={isProcessing}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-purple-400 hover:text-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
                <span className="text-sm font-medium">Processing...</span>
              </>
            ) : (
              <>
                <CameraIcon className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Photo Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Add at least 3-4 photos for better matches</li>
          <li>• Include a clear face photo as your main picture</li>
          <li>• Show your interests and hobbies</li>
          <li>• Use recent photos that represent you well</li>
          <li>• Photos are automatically resized and compressed for optimal loading</li>
        </ul>
      </div>
    </div>
  );
}