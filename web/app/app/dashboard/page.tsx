"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  SparklesIcon, 
  HeartIcon, 
  UserGroupIcon,
  FireIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../../../lib/hooks";
import { logout } from "../../../lib/features/auth/authSlice";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const tierConfig = {
    spark: {
      name: 'Spark',
      color: 'from-orange-500 to-red-500',
      icon: SparklesIcon,
      features: ['Tonight Mode', 'Local Events', 'Stories']
    },
    connect: {
      name: 'Connect',
      color: 'from-blue-500 to-purple-500',
      icon: HeartIcon,
      features: ['Daily Matches', 'Video Dates', 'Personality Insights']
    },
    forever: {
      name: 'Forever',
      color: 'from-purple-600 to-pink-600',
      icon: UserGroupIcon,
      features: ['Compatibility Analysis', 'Background Verification', 'Matchmaker Support']
    }
  };

  const currentTier = tierConfig[user.tier];
  const TierIcon = currentTier.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                LoveConnect
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentTier.color} p-1.5`}>
                  <TierIcon className="w-full h-full text-white" />
                </div>
                <span className="font-medium">{currentTier.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user.firstName}!
          </h2>
          <p className="text-gray-600">
            Ready to continue your {currentTier.name} journey?
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FireIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold">24</p>
                <p className="text-gray-600 text-sm">Likes Today</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <HeartIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold">7</p>
                <p className="text-gray-600 text-sm">New Matches</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold">3</p>
                <p className="text-gray-600 text-sm">Active Chats</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold">156</p>
                <p className="text-gray-600 text-sm">Profile Views</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Start Matching */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentTier.color} p-4 mx-auto mb-4`}>
              <TierIcon className="w-full h-full text-white" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Start Matching</h3>
            <p className="text-gray-600 text-center mb-4">
              Discover new people in your {currentTier.name} tier
            </p>
            <button className={`w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r ${currentTier.color} hover:shadow-lg transform hover:scale-105 transition-all duration-200`}>
              Start Swiping
            </button>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Messages</h3>
            <p className="text-gray-600 text-center mb-4">
              Continue conversations with your matches
            </p>
            <button className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              View Messages
            </button>
          </div>

          {/* Profile */}
          <div 
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => router.push('/app/profile')}
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">My Profile</h3>
            <p className="text-gray-600 text-center mb-4">
              Update your profile and photos
            </p>
            <div className="space-y-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/app/profile');
                }}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Edit Profile
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/app/profile/wizard?step=1');
                }}
                className="w-full py-2 px-4 rounded-lg font-medium text-purple-600 border border-purple-500 hover:bg-purple-50 transition-all duration-200"
              >
                Setup Wizard
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tier Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-8 shadow-lg"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">
            Your {currentTier.name} Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentTier.features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentTier.color} p-3 mx-auto mb-3`}>
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <div className={`w-4 h-4 bg-gradient-to-r ${currentTier.color} rounded-full`}></div>
                  </div>
                </div>
                <p className="font-semibold">{feature}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}