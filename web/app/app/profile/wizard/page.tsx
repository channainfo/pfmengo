"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../lib/hooks";
import { fetchProfileAsync } from "../../../../lib/features/profile/profileSlice";
import AuthWrapper from "../../../../components/AuthWrapper";
import ProfileWizard from "../../../../components/ProfileWizard";
import { isProfileComplete } from "../../../../lib/utils/profileUtils";


export default function ProfileWizardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { profile, isLoading } = useAppSelector((state) => state.profile);
  const { user } = useAppSelector((state) => state.auth);

  // Get current step from URL, default to 1
  const currentStep = parseInt(searchParams.get('step') || '1', 10);
  const maxStep = 4;

  useEffect(() => {
    // Fetch profile data
    dispatch(fetchProfileAsync());
  }, [dispatch]);

  useEffect(() => {
    // Check if profile is already complete and user came here automatically (not manually)
    if (!isLoading && user && profile) {
      const profileComplete = isProfileComplete(profile);
      
      // Check if user was forced here due to incomplete profile (has 'auto' parameter)
      const wasAutoRedirected = searchParams.get('auto') === 'true';
      
      // Only redirect back if profile is complete AND user was auto-redirected here
      if (profileComplete && wasAutoRedirected) {
        router.push('/app/profile');
        return;
      }
    }
  }, [profile, isLoading, user, router, searchParams]);

  useEffect(() => {
    // Validate step parameter and redirect if invalid
    if (currentStep < 1 || currentStep > maxStep) {
      router.replace('/app/profile/wizard?step=1');
    }
  }, [currentStep, maxStep, router]);

  // Navigation functions
  const goToStep = (step: number) => {
    if (step >= 1 && step <= maxStep) {
      router.push(`/app/profile/wizard?step=${step}`);
    }
  };

  const nextStep = () => {
    if (currentStep < maxStep) {
      goToStep(currentStep + 1);
    } else {
      // Completed all steps
      handleWizardComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const handleWizardComplete = () => {
    // Refresh profile data and redirect to profile page
    // The wizardStep in the database already tracks completion
    dispatch(fetchProfileAsync());
    router.push('/app/profile');
  };

  const handleWizardCancel = () => {
    // Redirect back to profile without marking as completed
    router.push('/app/profile');
  };

  if (isLoading) {
    return (
      <AuthWrapper>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </AuthWrapper>
    );
  }

  if (!profile || !user) {
    return (
      <AuthWrapper>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-4">Unable to load your profile data.</p>
            <button
              onClick={() => router.push('/app/profile')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go to Profile
            </button>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      {/* Navigation breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => router.push('/app/profile')}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
            >
              ← Back to Profile
            </button>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-sm text-gray-600">Profile Setup Wizard</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-sm text-gray-500">Step {currentStep} of {maxStep}</span>
          </div>
        </div>
      </div>

      {/* Show helpful message if profile is complete and user manually came here */}
      {profile && user && isProfileComplete(profile) && !searchParams.get('auto') && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Profile Update Mode</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Your profile is already complete! You can use this wizard to update any information or simply return to your profile page.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <ProfileWizard
        initialData={profile}
        userTier={user.tier}
        currentStep={currentStep}
        onNextStep={nextStep}
        onPrevStep={prevStep}
        onGoToStep={goToStep}
        onComplete={handleWizardComplete}
        onCancel={handleWizardCancel}
      />
    </AuthWrapper>
  );
}