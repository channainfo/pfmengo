/* eslint-disable @typescript-eslint/no-explicit-any */
// Utility function to check if profile is complete based on wizard step
export const isProfileComplete = (profile: any): boolean => {
  if (!profile) return false;

  // Profile is complete if user has completed all 4 steps of the wizard
  // wizardStep 4 means they've gone through: Basic Info -> Location -> Tier Profile -> Photos
  return profile.wizardStep >= 4;
};

// Legacy function for backwards compatibility and detailed checking
export const getProfileCompleteness = (profile: any): {
  isComplete: boolean;
  completedSteps: number;
  totalSteps: number;
  percentage: number;
} => {
  if (!profile) {
    return { isComplete: false, completedSteps: 0, totalSteps: 4, percentage: 0 };
  }

  const totalSteps = 4;
  const completedSteps = Math.max(0, Math.min(profile.wizardStep || 0, totalSteps));
  const percentage = Math.round((completedSteps / totalSteps) * 100);

  return {
    isComplete: completedSteps >= totalSteps,
    completedSteps,
    totalSteps,
    percentage
  };
};