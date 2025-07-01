import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  SlideInRight,
} from 'react-native-reanimated';

import PhotoUpload from './PhotoUpload';
import { TierType } from '../types';

const { width } = Dimensions.get('window');

interface ProfileFormData {
  bio?: string;
  location?: string;
  interests: string[];
  photos: string[];
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

interface ProfileFormProps {
  initialData?: Partial<ProfileFormData>;
  userTier: TierType;
  onSave: (data: ProfileFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData,
  userTier,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    bio: initialData?.bio || '',
    location: initialData?.location || '',
    interests: initialData?.interests || [],
    photos: initialData?.photos || [],
    sparkProfile: initialData?.sparkProfile || {
      lookingFor: '',
      availability: '',
      activities: [],
    },
    connectProfile: initialData?.connectProfile || {
      relationshipGoals: '',
      values: [],
      lifestyle: '',
      education: '',
      profession: '',
    },
    foreverProfile: initialData?.foreverProfile || {
      marriageTimeline: '',
      familyPlans: '',
      religiousViews: '',
      financialGoals: '',
      livingPreferences: '',
    },
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [newInterest, setNewInterest] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [newValue, setNewValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const progressValue = useSharedValue(0);
  
  const steps = ['Basic Info', 'Photos', `${userTier.charAt(0).toUpperCase() + userTier.slice(1)} Profile`];
  
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
  
  const tierConfig = getTierConfig(userTier);
  
  useEffect(() => {
    progressValue.value = withSpring((currentStep / (steps.length - 1)) * 100);
  }, [currentStep]);
  
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 0) {
      // Basic Info validation
      if (!formData.bio || formData.bio.trim().length < 10) {
        newErrors.bio = 'Bio must be at least 10 characters';
      }
      if (!formData.location || formData.location.trim().length === 0) {
        newErrors.location = 'Location is required';
      }
      if (formData.interests.length === 0) {
        newErrors.interests = 'Add at least one interest';
      }
    } else if (currentStep === 1) {
      // Photos validation
      if (formData.photos.length === 0) {
        newErrors.photos = 'Add at least one photo';
      }
    } else if (currentStep === 2) {
      // Tier-specific validation
      if (userTier === 'spark') {
        if (!formData.sparkProfile?.lookingFor) {
          newErrors.lookingFor = 'Please select what you\'re looking for';
        }
        if (!formData.sparkProfile?.availability) {
          newErrors.availability = 'Please select your availability';
        }
        if (formData.sparkProfile?.activities.length === 0) {
          newErrors.activities = 'Add at least one activity';
        }
      } else if (userTier === 'connect') {
        if (!formData.connectProfile?.relationshipGoals || formData.connectProfile.relationshipGoals.length < 20) {
          newErrors.relationshipGoals = 'Please provide more detail about your relationship goals (at least 20 characters)';
        }
        if (!formData.connectProfile?.lifestyle) {
          newErrors.lifestyle = 'Please describe your lifestyle';
        }
        if (formData.connectProfile?.values.length === 0) {
          newErrors.values = 'Add at least one core value';
        }
      } else if (userTier === 'forever') {
        if (!formData.foreverProfile?.marriageTimeline) {
          newErrors.marriageTimeline = 'Please select your marriage timeline';
        }
        if (!formData.foreverProfile?.familyPlans || formData.foreverProfile.familyPlans.length < 20) {
          newErrors.familyPlans = 'Please provide more detail about your family plans (at least 20 characters)';
        }
        if (!formData.foreverProfile?.financialGoals || formData.foreverProfile.financialGoals.length < 20) {
          newErrors.financialGoals = 'Please provide more detail about your financial goals (at least 20 characters)';
        }
        if (!formData.foreverProfile?.livingPreferences) {
          newErrors.livingPreferences = 'Please describe your living preferences';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSave();
      }
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };
  
  const handleSave = async () => {
    if (validateCurrentStep()) {
      try {
        await onSave(formData);
      } catch (error) {
        Alert.alert('Error', 'Failed to save profile. Please try again.');
      }
    }
  };
  
  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()],
      });
      setNewInterest('');
    }
  };
  
  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest),
    });
  };
  
  const addActivity = () => {
    if (newActivity.trim() && !formData.sparkProfile?.activities.includes(newActivity.trim())) {
      setFormData({
        ...formData,
        sparkProfile: {
          ...formData.sparkProfile!,
          activities: [...(formData.sparkProfile?.activities || []), newActivity.trim()],
        },
      });
      setNewActivity('');
    }
  };
  
  const removeActivity = (activity: string) => {
    setFormData({
      ...formData,
      sparkProfile: {
        ...formData.sparkProfile!,
        activities: formData.sparkProfile?.activities.filter(a => a !== activity) || [],
      },
    });
  };
  
  const addValue = () => {
    if (newValue.trim() && !formData.connectProfile?.values.includes(newValue.trim())) {
      setFormData({
        ...formData,
        connectProfile: {
          ...formData.connectProfile!,
          values: [...(formData.connectProfile?.values || []), newValue.trim()],
        },
      });
      setNewValue('');
    }
  };
  
  const removeValue = (value: string) => {
    setFormData({
      ...formData,
      connectProfile: {
        ...formData.connectProfile!,
        values: formData.connectProfile?.values.filter(v => v !== value) || [],
      },
    });
  };
  
  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressValue.value}%`,
    };
  });
  
  const renderBasicInfo = () => (
    <Animated.View entering={FadeIn} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Bio *</Text>
        <TextInput
          style={[styles.textArea, errors.bio && styles.errorInput]}
          value={formData.bio}
          onChangeText={(text) => setFormData({ ...formData, bio: text })}
          placeholder="Tell others about yourself..."
          multiline
          numberOfLines={4}
          maxLength={500}
        />
        {errors.bio && <Text style={styles.errorText}>{errors.bio}</Text>}
        <Text style={styles.characterCount}>{formData.bio?.length || 0}/500</Text>
      </View>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Location *</Text>
        <TextInput
          style={[styles.textInput, errors.location && styles.errorInput]}
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
          placeholder="City, State"
        />
        {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
      </View>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Interests *</Text>
        <View style={styles.tagsContainer}>
          {formData.interests.map((interest, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: tierConfig.colors[0] }]}>
              <Text style={styles.tagText}>{interest}</Text>
              <TouchableOpacity onPress={() => removeInterest(interest)}>
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.addTagContainer}>
          <TextInput
            style={styles.addTagInput}
            value={newInterest}
            onChangeText={setNewInterest}
            placeholder="Add an interest"
            onSubmitEditing={addInterest}
          />
          <TouchableOpacity onPress={addInterest} style={[styles.addButton, { backgroundColor: tierConfig.colors[0] }]}>
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
        {errors.interests && <Text style={styles.errorText}>{errors.interests}</Text>}
      </View>
    </Animated.View>
  );
  
  const renderPhotos = () => (
    <Animated.View entering={SlideInRight} style={styles.stepContainer}>
      <PhotoUpload
        photos={formData.photos}
        onPhotosChange={(photos) => setFormData({ ...formData, photos })}
        maxPhotos={6}
        tierColors={tierConfig.colors}
      />
      {errors.photos && <Text style={styles.errorText}>{errors.photos}</Text>}
    </Animated.View>
  );
  
  const renderTierProfile = () => (
    <Animated.View entering={SlideInRight} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{tierConfig.name} Profile</Text>
      
      {userTier === 'spark' && (
        <>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>What are you looking for? *</Text>
            <View style={[styles.pickerContainer, errors.lookingFor && styles.errorInput]}>
              <Picker
                selectedValue={formData.sparkProfile?.lookingFor}
                onValueChange={(value) => setFormData({
                  ...formData,
                  sparkProfile: { ...formData.sparkProfile!, lookingFor: value },
                })}
                style={styles.picker}
              >
                <Picker.Item label="Select..." value="" />
                <Picker.Item label="Casual Dating" value="casual_dating" />
                <Picker.Item label="Fun Experiences" value="fun_experiences" />
                <Picker.Item label="New Friends" value="new_friends" />
                <Picker.Item label="Adventure Partner" value="adventure_partner" />
              </Picker>
            </View>
            {errors.lookingFor && <Text style={styles.errorText}>{errors.lookingFor}</Text>}
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Availability *</Text>
            <View style={[styles.pickerContainer, errors.availability && styles.errorInput]}>
              <Picker
                selectedValue={formData.sparkProfile?.availability}
                onValueChange={(value) => setFormData({
                  ...formData,
                  sparkProfile: { ...formData.sparkProfile!, availability: value },
                })}
                style={styles.picker}
              >
                <Picker.Item label="Select..." value="" />
                <Picker.Item label="Weekends" value="weekends" />
                <Picker.Item label="Weeknights" value="weeknights" />
                <Picker.Item label="Flexible" value="flexible" />
                <Picker.Item label="Spontaneous" value="spontaneous" />
              </Picker>
            </View>
            {errors.availability && <Text style={styles.errorText}>{errors.availability}</Text>}
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Favorite Activities *</Text>
            <View style={styles.tagsContainer}>
              {formData.sparkProfile?.activities.map((activity, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: tierConfig.colors[0] }]}>
                  <Text style={styles.tagText}>{activity}</Text>
                  <TouchableOpacity onPress={() => removeActivity(activity)}>
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={styles.addTagContainer}>
              <TextInput
                style={styles.addTagInput}
                value={newActivity}
                onChangeText={setNewActivity}
                placeholder="Add an activity"
                onSubmitEditing={addActivity}
              />
              <TouchableOpacity onPress={addActivity} style={[styles.addButton, { backgroundColor: tierConfig.colors[0] }]}>
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
            {errors.activities && <Text style={styles.errorText}>{errors.activities}</Text>}
          </View>
        </>
      )}
      
      {userTier === 'connect' && (
        <>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Relationship Goals *</Text>
            <TextInput
              style={[styles.textArea, errors.relationshipGoals && styles.errorInput]}
              value={formData.connectProfile?.relationshipGoals}
              onChangeText={(text) => setFormData({
                ...formData,
                connectProfile: { ...formData.connectProfile!, relationshipGoals: text },
              })}
              placeholder="What are you looking for in a relationship?"
              multiline
              numberOfLines={3}
            />
            {errors.relationshipGoals && <Text style={styles.errorText}>{errors.relationshipGoals}</Text>}
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Core Values *</Text>
            <View style={styles.tagsContainer}>
              {formData.connectProfile?.values.map((value, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: tierConfig.colors[0] }]}>
                  <Text style={styles.tagText}>{value}</Text>
                  <TouchableOpacity onPress={() => removeValue(value)}>
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={styles.addTagContainer}>
              <TextInput
                style={styles.addTagInput}
                value={newValue}
                onChangeText={setNewValue}
                placeholder="Add a core value"
                onSubmitEditing={addValue}
              />
              <TouchableOpacity onPress={addValue} style={[styles.addButton, { backgroundColor: tierConfig.colors[0] }]}>
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
            {errors.values && <Text style={styles.errorText}>{errors.values}</Text>}
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Lifestyle *</Text>
            <TextInput
              style={[styles.textInput, errors.lifestyle && styles.errorInput]}
              value={formData.connectProfile?.lifestyle}
              onChangeText={(text) => setFormData({
                ...formData,
                connectProfile: { ...formData.connectProfile!, lifestyle: text },
              })}
              placeholder="Describe your lifestyle"
            />
            {errors.lifestyle && <Text style={styles.errorText}>{errors.lifestyle}</Text>}
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Education</Text>
            <TextInput
              style={styles.textInput}
              value={formData.connectProfile?.education}
              onChangeText={(text) => setFormData({
                ...formData,
                connectProfile: { ...formData.connectProfile!, education: text },
              })}
              placeholder="Your education background"
            />
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Profession</Text>
            <TextInput
              style={styles.textInput}
              value={formData.connectProfile?.profession}
              onChangeText={(text) => setFormData({
                ...formData,
                connectProfile: { ...formData.connectProfile!, profession: text },
              })}
              placeholder="Your profession or career"
            />
          </View>
        </>
      )}
      
      {userTier === 'forever' && (
        <>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Marriage Timeline *</Text>
            <View style={[styles.pickerContainer, errors.marriageTimeline && styles.errorInput]}>
              <Picker
                selectedValue={formData.foreverProfile?.marriageTimeline}
                onValueChange={(value) => setFormData({
                  ...formData,
                  foreverProfile: { ...formData.foreverProfile!, marriageTimeline: value },
                })}
                style={styles.picker}
              >
                <Picker.Item label="Select..." value="" />
                <Picker.Item label="Within 1 year" value="1_year" />
                <Picker.Item label="Within 2 years" value="2_years" />
                <Picker.Item label="Within 3 years" value="3_years" />
                <Picker.Item label="Open to timeline" value="open" />
              </Picker>
            </View>
            {errors.marriageTimeline && <Text style={styles.errorText}>{errors.marriageTimeline}</Text>}
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Family Plans *</Text>
            <TextInput
              style={[styles.textArea, errors.familyPlans && styles.errorInput]}
              value={formData.foreverProfile?.familyPlans}
              onChangeText={(text) => setFormData({
                ...formData,
                foreverProfile: { ...formData.foreverProfile!, familyPlans: text },
              })}
              placeholder="Your thoughts on having children and family life"
              multiline
              numberOfLines={3}
            />
            {errors.familyPlans && <Text style={styles.errorText}>{errors.familyPlans}</Text>}
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Religious Views</Text>
            <TextInput
              style={styles.textInput}
              value={formData.foreverProfile?.religiousViews}
              onChangeText={(text) => setFormData({
                ...formData,
                foreverProfile: { ...formData.foreverProfile!, religiousViews: text },
              })}
              placeholder="Your religious or spiritual beliefs"
            />
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Financial Goals *</Text>
            <TextInput
              style={[styles.textArea, errors.financialGoals && styles.errorInput]}
              value={formData.foreverProfile?.financialGoals}
              onChangeText={(text) => setFormData({
                ...formData,
                foreverProfile: { ...formData.foreverProfile!, financialGoals: text },
              })}
              placeholder="Your financial aspirations and planning approach"
              multiline
              numberOfLines={2}
            />
            {errors.financialGoals && <Text style={styles.errorText}>{errors.financialGoals}</Text>}
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Living Preferences *</Text>
            <TextInput
              style={[styles.textInput, errors.livingPreferences && styles.errorInput]}
              value={formData.foreverProfile?.livingPreferences}
              onChangeText={(text) => setFormData({
                ...formData,
                foreverProfile: { ...formData.foreverProfile!, livingPreferences: text },
              })}
              placeholder="Where and how you'd like to live"
            />
            {errors.livingPreferences && <Text style={styles.errorText}>{errors.livingPreferences}</Text>}
          </View>
        </>
      )}
    </Animated.View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        {/* Header */}
        <LinearGradient colors={tierConfig.colors} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={styles.placeholder} />
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
            </View>
            <Text style={styles.progressText}>
              Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
            </Text>
          </View>
        </LinearGradient>
        
        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {currentStep === 0 && renderBasicInfo()}
          {currentStep === 1 && renderPhotos()}
          {currentStep === 2 && renderTierProfile()}
        </ScrollView>
        
        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleBack}
            style={[styles.footerButton, styles.backFooterButton]}
          >
            <Text style={styles.backButtonText}>
              {currentStep === 0 ? 'Cancel' : 'Back'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleNext}
            disabled={isLoading}
            style={styles.footerButton}
          >
            <LinearGradient colors={tierConfig.colors} style={styles.nextButton}>
              {isLoading ? (
                <Text style={styles.nextButtonText}>Saving...</Text>
              ) : (
                <Text style={styles.nextButtonText}>
                  {currentStep === steps.length - 1 ? 'Save Profile' : 'Next'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBackground: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 20,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  errorInput: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  characterCount: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  addTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addTagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
    marginRight: 12,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerButton: {
    flex: 1,
  },
  backFooterButton: {
    marginRight: 12,
  },
  backButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    paddingVertical: 16,
  },
  nextButton: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileForm;