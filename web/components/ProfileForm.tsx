"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import PhotoUpload from "./PhotoUpload";

interface ProfileFormData {
  bio?: string;
  interests: string[];
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

interface ProfileFormProps {
  initialData?: Partial<ProfileFormData>;
  userTier: 'spark' | 'connect' | 'forever';
  onSave: (data: ProfileFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const baseSchema = yup.object({
  bio: yup.string().max(500, "Bio must be less than 500 characters"),
  interests: yup.array().of(yup.string()).min(1, "Add at least one interest"),
  photos: yup.array().of(yup.string()).min(1, "Add at least one photo"),
});

const sparkSchema = baseSchema.shape({
  sparkProfile: yup.object({
    lookingFor: yup.string().required("Please select what you're looking for"),
    availability: yup.string().required("Please select your availability"),
    activities: yup.array().of(yup.string()).min(1, "Add at least one activity"),
  }),
});

const connectSchema = baseSchema.shape({
  connectProfile: yup.object({
    relationshipGoals: yup.string().required("Please describe your relationship goals").min(20, "Please provide more detail about your goals"),
    values: yup.array().of(yup.string()).min(1, "Add at least one value"),
    lifestyle: yup.string().required("Please describe your lifestyle"),
    education: yup.string(),
    profession: yup.string(),
  }),
});

const foreverSchema = baseSchema.shape({
  foreverProfile: yup.object({
    marriageTimeline: yup.string().required("Please select your marriage timeline"),
    familyPlans: yup.string().required("Please describe your family plans").min(20, "Please provide more detail about your family plans"),
    religiousViews: yup.string(),
    financialGoals: yup.string().required("Please describe your financial goals").min(20, "Please provide more detail about your financial goals"),
    livingPreferences: yup.string().required("Please describe your living preferences"),
  }),
});

export default function ProfileForm({ 
  initialData, 
  userTier, 
  onSave, 
  onCancel, 
  isLoading = false 
}: ProfileFormProps) {
  const [newInterest, setNewInterest] = useState("");
  const [newActivity, setNewActivity] = useState("");
  const [newValue, setNewValue] = useState("");
  const [photos, setPhotos] = useState<string[]>(initialData?.photos || []);

  const schema = userTier === 'spark' ? sparkSchema : userTier === 'connect' ? connectSchema : foreverSchema;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      bio: initialData?.bio || '',
      interests: initialData?.interests || [],
      photos: photos,
      [userTier + 'Profile']: initialData?.[userTier + 'Profile' as keyof ProfileFormData] || {},
    },
  });

  const watchedInterests = watch('interests') || [];
  const watchedActivities = watch('sparkProfile.activities') || [];
  const watchedValues = watch('connectProfile.values') || [];

  // Update photos in form when PhotoUpload changes
  useEffect(() => {
    setValue('photos', photos);
  }, [photos, setValue]);

  const addInterest = () => {
    if (newInterest.trim() && !watchedInterests.includes(newInterest.trim())) {
      const updated = [...watchedInterests, newInterest.trim()];
      setValue('interests', updated);
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    const updated = watchedInterests.filter(i => i !== interest);
    setValue('interests', updated);
  };

  const addActivity = () => {
    if (newActivity.trim() && !watchedActivities.includes(newActivity.trim())) {
      const updated = [...watchedActivities, newActivity.trim()];
      setValue('sparkProfile.activities', updated);
      setNewActivity("");
    }
  };

  const removeActivity = (activity: string) => {
    const updated = watchedActivities.filter(a => a !== activity);
    setValue('sparkProfile.activities', updated);
  };

  const addValue = () => {
    if (newValue.trim() && !watchedValues.includes(newValue.trim())) {
      const updated = [...watchedValues, newValue.trim()];
      setValue('connectProfile.values', updated);
      setNewValue("");
    }
  };

  const removeValue = (value: string) => {
    const updated = watchedValues.filter(v => v !== value);
    setValue('connectProfile.values', updated);
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await onSave({ ...data, photos });
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h3 className="text-xl font-bold mb-4">Basic Information</h3>
        
        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio *
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


        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interests *
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {watchedInterests.map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center"
              >
                {interest}
                <button
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="ml-2 text-purple-500 hover:text-purple-700"
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
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
          {errors.interests && (
            <p className="mt-1 text-sm text-red-600">{errors.interests.message}</p>
          )}
        </div>
      </motion.div>

      {/* Photos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-xl font-bold mb-4">Photos *</h3>
        <PhotoUpload
          photos={photos}
          onPhotosChange={setPhotos}
          maxPhotos={6}
        />
        {errors.photos && (
          <p className="mt-1 text-sm text-red-600">{errors.photos.message}</p>
        )}
      </motion.div>

      {/* Tier-Specific Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h3 className="text-xl font-bold mb-4">
          {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Profile
        </h3>
        
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
                {watchedActivities.map((activity, index) => (
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
                {watchedValues.map((value, index) => (
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

      {/* Form Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4 pt-6 border-t border-gray-200"
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              Save Profile
            </>
          )}
        </button>
      </motion.div>
    </form>
  );
}