import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { RootState, AppDispatch } from '../store';
import { fetchProfile, updateProfile } from '../store/slices/profileSlice';
import ProfileForm from '../components/ProfileForm';
import PhotoUpload from '../components/PhotoUpload';
import { TierType } from '../types';

const { width, height } = Dimensions.get('window');

interface ProfileData {
  id: string;
  userId: string;
  bio?: string;
  age: number;
  location?: string;
  interests: string[];
  photos: string[];
  isComplete: boolean;
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

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.profile);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'tier' | 'photos'>('basic');
  const [refreshing, setRefreshing] = useState(false);
  
  const progressValue = useSharedValue(0);
  const editButtonScale = useSharedValue(1);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      await dispatch(fetchProfile()).unwrap();
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const calculateCompleteness = (): number => {
    if (!profile || !user) return 0;
    
    let total = 0;
    let completed = 0;

    // Basic profile fields
    const basicFields = ['bio', 'age', 'location', 'interests'];
    total += basicFields.length;
    if (profile.bio) completed++;
    if (profile.age) completed++;
    if (profile.location) completed++;
    if (profile.interests && profile.interests.length > 0) completed++;

    // Photos
    total += 1;
    if (profile.photos && profile.photos.length > 0) completed++;

    // Tier-specific fields
    if (user.tier === 'spark' && profile.sparkProfile) {
      total += 3;
      if (profile.sparkProfile.lookingFor) completed++;
      if (profile.sparkProfile.availability) completed++;
      if (profile.sparkProfile.activities && profile.sparkProfile.activities.length > 0) completed++;
    } else if (user.tier === 'connect' && profile.connectProfile) {
      total += 5;
      if (profile.connectProfile.relationshipGoals) completed++;
      if (profile.connectProfile.values && profile.connectProfile.values.length > 0) completed++;
      if (profile.connectProfile.lifestyle) completed++;
      if (profile.connectProfile.education) completed++;
      if (profile.connectProfile.profession) completed++;
    } else if (user.tier === 'forever' && profile.foreverProfile) {
      total += 5;
      if (profile.foreverProfile.marriageTimeline) completed++;
      if (profile.foreverProfile.familyPlans) completed++;
      if (profile.foreverProfile.religiousViews) completed++;
      if (profile.foreverProfile.financialGoals) completed++;
      if (profile.foreverProfile.livingPreferences) completed++;
    } else {
      total += user.tier === 'spark' ? 3 : 5;
    }

    const percentage = Math.round((completed / total) * 100);
    progressValue.value = withTiming(percentage, { duration: 800 });
    return percentage;
  };

  const getTierConfig = (tier: TierType) => {
    const configs = {
      spark: {
        name: 'Spark',
        colors: ['#f97316', '#dc2626'],
        icon: 'sparkles',
      },
      connect: {
        name: 'Connect',
        colors: ['#3b82f6', '#8b5cf6'],
        icon: 'heart',
      },
      forever: {
        name: 'Forever',
        colors: ['#8b5cf6', '#ec4899'],
        icon: 'people',
      },
    };
    return configs[tier];
  };

  const handleSaveProfile = async (formData: any) => {
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setEditMode(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleEditPress = () => {
    editButtonScale.value = withSpring(0.9, {}, () => {
      editButtonScale.value = withSpring(1);
    });
    setEditMode(true);
  };

  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressValue.value}%`,
    };
  });

  const editButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: editButtonScale.value }],
    };
  });

  if (loading && !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Please log in to view your profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  const tierConfig = getTierConfig(user.tier);
  const completeness = calculateCompleteness();

  if (editMode) {
    return (
      <SafeAreaView style={styles.container}>
        <ProfileForm
          initialData={profile}
          userTier={user.tier}
          onSave={handleSaveProfile}
          onCancel={() => setEditMode(false)}
          isLoading={loading}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={tierConfig.colors}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.tierBadge}>
              <Ionicons name={tierConfig.icon as any} size={16} color="white" />
              <Text style={styles.tierText}>{tierConfig.name}</Text>
            </View>
          </View>
          
          {/* Profile Photo */}
          <View style={styles.profilePhotoContainer}>
            <View style={styles.profilePhotoWrapper}>
              {profile?.photos && profile.photos.length > 0 ? (
                <Image source={{ uri: profile.photos[0] }} style={styles.profilePhoto} />
              ) : (
                <View style={styles.placeholderPhoto}>
                  <Ionicons name="person" size={40} color="#9ca3af" />
                </View>
              )}
              <TouchableOpacity style={styles.cameraButton}>
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Basic Info */}
          <View style={styles.basicInfo}>
            <Text style={styles.name}>
              {user.firstName} {user.lastName}
            </Text>
            <View style={styles.infoRow}>
              {profile?.age && (
                <View style={styles.infoItem}>
                  <Ionicons name="calendar" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.infoText}>{profile.age} years old</Text>
                </View>
              )}
              {profile?.location && (
                <View style={styles.infoItem}>
                  <Ionicons name="location" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.infoText}>{profile.location}</Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>

        {/* Profile Completeness */}
        <View style={styles.completenessCard}>
          <View style={styles.completenessHeader}>
            <Text style={styles.completenessTitle}>Profile Completeness</Text>
            <Text style={styles.completenessPercentage}>{completeness}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                progressAnimatedStyle,
                { backgroundColor: tierConfig.colors[0] },
              ]}
            />
          </View>
          {completeness < 80 && (
            <View style={styles.completenessWarning}>
              <Ionicons name="warning" size={16} color="#f59e0b" />
              <Text style={styles.warningText}>
                Complete your profile to get better matches
              </Text>
            </View>
          )}
        </View>

        {/* Bio */}
        {profile?.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>
        )}

        {/* Interests */}
        {profile?.interests && profile.interests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsContainer}>
              {profile.interests.map((interest, index) => (
                <LinearGradient
                  key={index}
                  colors={tierConfig.colors}
                  style={styles.interestTag}
                >
                  <Text style={styles.interestText}>{interest}</Text>
                </LinearGradient>
              ))}
            </View>
          </View>
        )}

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {[
            { id: 'basic', label: 'Basic Info', icon: 'person' },
            { id: 'tier', label: `${tierConfig.name} Profile`, icon: tierConfig.icon },
            { id: 'photos', label: 'Photos', icon: 'camera' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id as any)}
              style={[
                styles.tab,
                activeTab === tab.id && {
                  borderBottomColor: tierConfig.colors[0],
                  borderBottomWidth: 2,
                },
              ]}
            >
              <Ionicons
                name={tab.icon as any}
                size={20}
                color={activeTab === tab.id ? tierConfig.colors[0] : '#6b7280'}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && { color: tierConfig.colors[0] },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'basic' && (
            <View style={styles.tabContentContainer}>
              <Text style={styles.tabContentTitle}>Basic Information</Text>
              
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Bio</Text>
                <Text style={styles.fieldValue}>
                  {profile?.bio || 'No bio added yet'}
                </Text>
              </View>
              
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Location</Text>
                <Text style={styles.fieldValue}>
                  {profile?.location || 'No location added yet'}
                </Text>
              </View>
              
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Interests</Text>
                <Text style={styles.fieldValue}>
                  {profile?.interests && profile.interests.length > 0
                    ? profile.interests.join(', ')
                    : 'No interests added yet'
                  }
                </Text>
              </View>
            </View>
          )}

          {activeTab === 'tier' && (
            <View style={styles.tabContentContainer}>
              <Text style={styles.tabContentTitle}>{tierConfig.name} Profile</Text>
              
              {user.tier === 'spark' && profile?.sparkProfile && (
                <>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Looking For</Text>
                    <Text style={styles.fieldValue}>
                      {profile.sparkProfile.lookingFor || 'Not specified'}
                    </Text>
                  </View>
                  
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Availability</Text>
                    <Text style={styles.fieldValue}>
                      {profile.sparkProfile.availability || 'Not specified'}
                    </Text>
                  </View>
                  
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Activities</Text>
                    <Text style={styles.fieldValue}>
                      {profile.sparkProfile.activities && profile.sparkProfile.activities.length > 0
                        ? profile.sparkProfile.activities.join(', ')
                        : 'No activities added yet'
                      }
                    </Text>
                  </View>
                </>
              )}

              {user.tier === 'connect' && profile?.connectProfile && (
                <>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Relationship Goals</Text>
                    <Text style={styles.fieldValue}>
                      {profile.connectProfile.relationshipGoals || 'Not specified'}
                    </Text>
                  </View>
                  
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Core Values</Text>
                    <Text style={styles.fieldValue}>
                      {profile.connectProfile.values && profile.connectProfile.values.length > 0
                        ? profile.connectProfile.values.join(', ')
                        : 'No values added yet'
                      }
                    </Text>
                  </View>
                  
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Education</Text>
                    <Text style={styles.fieldValue}>
                      {profile.connectProfile.education || 'Not specified'}
                    </Text>
                  </View>
                  
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Profession</Text>
                    <Text style={styles.fieldValue}>
                      {profile.connectProfile.profession || 'Not specified'}
                    </Text>
                  </View>
                </>
              )}

              {user.tier === 'forever' && profile?.foreverProfile && (
                <>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Marriage Timeline</Text>
                    <Text style={styles.fieldValue}>
                      {profile.foreverProfile.marriageTimeline || 'Not specified'}
                    </Text>
                  </View>
                  
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Family Plans</Text>
                    <Text style={styles.fieldValue}>
                      {profile.foreverProfile.familyPlans || 'Not specified'}
                    </Text>
                  </View>
                  
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Financial Goals</Text>
                    <Text style={styles.fieldValue}>
                      {profile.foreverProfile.financialGoals || 'Not specified'}
                    </Text>
                  </View>
                </>
              )}
            </View>
          )}

          {activeTab === 'photos' && (
            <View style={styles.tabContentContainer}>
              <Text style={styles.tabContentTitle}>Photo Gallery</Text>
              
              <View style={styles.photosGrid}>
                {profile?.photos && profile.photos.length > 0 ? (
                  profile.photos.map((photo, index) => (
                    <View key={index} style={styles.photoItem}>
                      <Image source={{ uri: photo }} style={styles.photoImage} />
                      {index === 0 && (
                        <View style={styles.mainPhotoBadge}>
                          <Text style={styles.mainPhotoText}>Main</Text>
                        </View>
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyPhotosText}>No photos uploaded yet</Text>
                )}
              </View>
              
              <View style={styles.photoTips}>
                <Text style={styles.photoTipsTitle}>Photo Tips</Text>
                <Text style={styles.photoTipsText}>
                  • Add at least 3-4 photos for better matches{"\n"}
                  • Include a clear face photo as your main picture{"\n"}
                  • Show your interests and hobbies{"\n"}
                  • Use recent photos that represent you well
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Edit Button */}
        <Animated.View style={[styles.editButtonContainer, editButtonAnimatedStyle]}>
          <TouchableOpacity onPress={handleEditPress}>
            <LinearGradient
              colors={tierConfig.colors}
              style={styles.editButton}
            >
              <Ionicons name="pencil" size={20} color="white" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tierText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  profilePhotoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePhotoWrapper: {
    position: 'relative',
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
  },
  placeholderPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  basicInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  infoText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginLeft: 4,
  },
  completenessCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completenessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  completenessTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  completenessPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  completenessWarning: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 12,
    color: '#f59e0b',
    marginLeft: 6,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 6,
  },
  tabContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabContentContainer: {
    padding: 20,
  },
  tabContentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 22,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  photoItem: {
    width: (width - 80) / 3,
    height: (width - 80) / 3,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  mainPhotoBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mainPhotoText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  emptyPhotosText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  photoTips: {
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  photoTipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  photoTipsText: {
    fontSize: 12,
    color: '#1e40af',
    lineHeight: 18,
  },
  editButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen;