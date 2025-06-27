// User and Authentication Types
export enum TierType {
  SPARK = 'spark',
  CONNECT = 'connect',
  FOREVER = 'forever',
}

export interface User {
  id: string;
  email: string;
  tier: TierType;
  profile: Profile;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  tier: TierType;
  firstName: string;
  lastName?: string;
  birthDate: string;
  gender?: 'male' | 'female' | 'non_binary' | 'other';
  location?: {
    lat: number;
    lng: number;
  };
  city?: string;
  country?: string;
  photos: ProfilePhoto[];
  bio?: string;
  interests?: string[];
  // Tier-specific data would be in separate interfaces
}

export interface ProfilePhoto {
  id: string;
  url: string;
  thumbnailUrl?: string;
  isPrimary: boolean;
  isVerified: boolean;
  orderIndex: number;
}

// Spark-specific types
export interface SparkProfile extends Profile {
  currentVibe?: string;
  tonightStatus?: string;
  stories?: Story[];
  lastActive?: string;
}

export interface Story {
  id: string;
  url: string;
  type: 'photo' | 'video';
  createdAt: string;
  expiresAt: string;
}

export interface SparkEvent {
  id: string;
  title: string;
  description: string;
  eventType: string;
  location: {
    lat: number;
    lng: number;
  };
  venueName?: string;
  startsAt: string;
  endsAt?: string;
  maxAttendees?: number;
  currentAttendees: number;
  distance?: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

// Connect-specific types
export interface ConnectProfile extends Profile {
  occupation?: string;
  education?: string;
  values?: string[];
  lifeGoals?: string[];
  personalityType?: string;
  relationshipTimeline?: string;
  wantsChildren?: boolean;
  childrenCountDesired?: number;
}

export interface CompatibilityReport {
  userId: string;
  targetUserId: string;
  overallScore: number;
  valuesAlignment: number;
  lifeGoals: number;
  personality: number;
  communication: number;
  insights: string[];
}

// Forever-specific types
export interface ForeverProfile extends Profile {
  fullName?: string;
  occupationDetail?: string;
  educationDetail?: string;
  incomeBracket?: string;
  familyBackground?: string;
  faith?: string;
  faithImportance?: 'very' | 'moderate' | 'low';
  financialPhilosophy?: string;
  healthLifestyle?: string;
  fiveYearPlan?: string;
  references?: Reference[];
  backgroundCheckStatus?: 'pending' | 'completed' | 'failed';
}

export interface Reference {
  id: string;
  name: string;
  relationship: string;
  contactInfo: string;
  videoUrl?: string;
  verified: boolean;
}

// Matching and Chat types
export interface Match {
  id: string;
  user: Profile;
  score: number;
  matchedAt?: string;
  status: 'pending' | 'matched' | 'expired' | 'unmatched';
  compatibilityData?: any;
}

export interface Conversation {
  id: string;
  matchId: string;
  participant: Profile;
  lastMessage?: Message;
  messageCount: number;
  isActive: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: {
    text?: string;
    mediaUrl?: string;
    thumbnailUrl?: string;
    duration?: number;
  };
  messageType: 'text' | 'image' | 'video' | 'audio' | 'gif';
  readAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

// API Response types
export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Navigation types
export type RootStackParamList = {
  // Auth Stack
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  TierSelection: undefined;
  
  // Main App
  Main: undefined;
  
  // Shared Screens
  Profile: { profileId?: string };
  Chat: { conversationId: string };
  Settings: undefined;
  
  // Spark Screens
  SparkHome: undefined;
  SparkEvents: undefined;
  SparkTonight: undefined;
  
  // Connect Screens
  ConnectHome: undefined;
  ConnectMatches: undefined;
  ConnectCompatibility: { matchId: string };
  
  // Forever Screens
  ForeverHome: undefined;
  ForeverInterview: undefined;
  ForeverPlanning: undefined;
};

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

export interface TierTheme {
  colors: ThemeColors;
  gradients: {
    primary: string[];
    secondary: string[];
  };
  animations: {
    duration: number;
    easing: string;
  };
}