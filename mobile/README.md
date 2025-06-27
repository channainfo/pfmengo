# Three-Tier Dating App - React Native Frontend

A modern React Native mobile application for the three-tier dating app, featuring distinct experiences for Spark (casual dating), Connect (serious relationships), and Forever (marriage-focused) users.

## 📱 Features

### 🔥 Spark Tier (Casual Dating)
- **Tonight Mode**: Swipe-based interface for spontaneous meetups
- **Live Events**: Browse and join local dating events
- **Stories**: 24-hour disappearing content
- **Quick Matching**: Fast-paced, location-based matching
- **Vibrant UI**: Orange/red color scheme with playful animations

### 💝 Connect Tier (Serious Relationships)
- **Daily Curated Matches**: Quality over quantity approach
- **Compatibility Scoring**: Advanced algorithm-based matching
- **Video Dating**: Built-in video call functionality
- **Deep Conversations**: AI-powered conversation starters
- **Thoughtful UI**: Blue/purple color scheme with clean design

### 💍 Forever Tier (Marriage-Focused)
- **Comprehensive Profiles**: Detailed personal information
- **Video Interviews**: Structured compatibility assessments
- **Life Planning**: 5-year goal alignment tools
- **Reference System**: Friend and family endorsements
- **Elegant UI**: Navy/gold color scheme with professional aesthetic

## 🏗 Architecture

### State Management
- **Redux Toolkit**: Global state management
- **Redux Persist**: Persistent authentication state
- **React Query**: Server state and caching

### Navigation
- **React Navigation 6**: Tab and stack navigation
- **Tier-based routing**: Dynamic navigation based on user tier
- **Deep linking**: Support for external app links

### UI Components
- **Expo**: Development platform and native APIs
- **React Native Elements**: UI component library
- **Linear Gradients**: Tier-specific color schemes
- **Animations**: Smooth micro-interactions

## 📁 Project Structure

```
mobile/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Screen components
│   │   ├── auth/          # Authentication screens
│   │   ├── spark/         # Spark tier screens
│   │   ├── connect/       # Connect tier screens
│   │   ├── forever/       # Forever tier screens
│   │   └── shared/        # Shared screens
│   ├── navigation/         # Navigation configuration
│   ├── store/             # Redux store and slices
│   ├── services/          # API integration
│   ├── types/             # TypeScript type definitions
│   ├── constants/         # App constants and themes
│   └── utils/             # Utility functions
├── assets/                # Images, fonts, and static assets
├── App.tsx               # Main application component
└── package.json          # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (Mac) or Android Emulator
- React Native development environment

### Installation

1. **Navigate to mobile directory**
```bash
cd mobile
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Run on device/simulator**
```bash
# iOS
npm run ios

# Android
npm run android

# Web (for testing)
npm run web
```

### Development Setup

1. **Environment Configuration**
   - Update API endpoints in `src/services/api.ts`
   - Configure push notifications
   - Set up deep linking

2. **Backend Connection**
   - Ensure the NestJS backend is running on `http://localhost:3000`
   - Update `API_BASE_URL` in api service for production

## 🎨 Design System

### Color Themes
Each tier has its own color palette and visual identity:

```typescript
// Spark Theme (Casual)
primary: '#FF6B6B'    // Coral
secondary: '#FFA502'  // Orange
accent: '#FFD93D'     // Yellow

// Connect Theme (Serious)
primary: '#4ECDC4'    // Teal
secondary: '#7B68EE'  // Purple
accent: '#95E1D3'     // Mint

// Forever Theme (Marriage)
primary: '#2C3E50'    // Navy
secondary: '#E8B4B8'  // Rose Gold
accent: '#F8F9FA'     // Pearl
```

### Typography
- **Headers**: SF Pro Display (iOS) / Roboto (Android)
- **Body**: SF Pro Text (iOS) / Roboto (Android)
- **Tier-specific weights**: Bold (Spark), Regular (Connect), Light (Forever)

## 🔧 Key Components

### Authentication Flow
```
WelcomeScreen → TierSelectionScreen → RegisterScreen
                                   ↘ LoginScreen
```

### Navigation Structure
```
AuthStack (Unauthenticated)
├── Welcome
├── TierSelection
├── Register
└── Login

MainApp (Authenticated)
├── TabNavigator (Tier-specific)
│   ├── HomeStack
│   ├── SecondaryStack (Events/Matches/Interview)
│   ├── Messages
│   └── Profile
└── ModalStacks
    ├── Profile
    ├── Chat
    └── Settings
```

### State Management
```typescript
// Redux Store Structure
{
  auth: {
    user: User | null,
    accessToken: string | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    error: string | null
  },
  profile: {
    currentProfile: Profile | null,
    viewedProfile: Profile | null,
    photos: ProfilePhoto[],
    isLoading: boolean,
    error: string | null
  },
  matching: {
    dailyMatches: Match[],
    tonightMatches: Match[],
    events: SparkEvent[],
    isLoading: boolean,
    error: string | null
  },
  chat: {
    conversations: Conversation[],
    messages: Message[],
    currentConversation: Conversation | null,
    isLoading: boolean,
    error: string | null
  }
}
```

## 📱 Screens Overview

### Authentication Screens
- **WelcomeScreen**: App introduction with tier preview
- **TierSelectionScreen**: Choose relationship goal
- **LoginScreen**: User authentication
- **RegisterScreen**: Account creation with tier selection

### Spark Screens
- **SparkHomeScreen**: Swipe-based matching interface
- **SparkEventsScreen**: Local events and activities
- **SparkTonightScreen**: Tonight mode for spontaneous meetups

### Connect Screens
- **ConnectHomeScreen**: Daily curated matches
- **ConnectMatchesScreen**: Match management
- **ConnectCompatibilityScreen**: Detailed compatibility reports

### Forever Screens
- **ForeverHomeScreen**: Comprehensive profile browsing
- **ForeverInterviewScreen**: Video interview system
- **ForeverPlanningScreen**: Life planning tools

### Shared Screens
- **MessagesScreen**: Chat conversations list
- **ChatScreen**: Individual conversation
- **ProfileScreen**: User profile management
- **SettingsScreen**: App preferences

## 🔌 API Integration

The app integrates with the NestJS backend through a comprehensive API service:

```typescript
// API Service Structure
{
  auth: {
    login, register, logout
  },
  profile: {
    getCurrentProfile, updateProfile, uploadMedia
  },
  matching: {
    getDailyMatches, likeUser, passUser, superLike
  },
  events: {
    getEvents, joinEvent, createEvent
  },
  chat: {
    getConversations, getMessages, sendMessage
  }
}
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 📦 Building for Production

### Android
```bash
# Build APK
npm run build:android

# Submit to Google Play
npm run submit:android
```

### iOS
```bash
# Build IPA
npm run build:ios

# Submit to App Store
npm run submit:ios
```

## 🚀 Deployment

The app uses Expo Application Services (EAS) for building and deployment:

1. **Configure EAS**
```bash
expo install @expo/cli
eas build:configure
```

2. **Build for stores**
```bash
eas build --platform all
```

3. **Submit to app stores**
```bash
eas submit --platform all
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **API Request Interceptors**: Automatic token refresh
- **Input Validation**: Client-side form validation
- **Secure Storage**: Encrypted credential storage
- **Deep Link Protection**: Authenticated route guards

## 🎯 Performance Optimizations

- **Redux Persist**: Selective state persistence
- **React Query**: Intelligent data caching
- **Image Optimization**: Lazy loading and caching
- **Bundle Splitting**: Tier-specific code splitting
- **Memory Management**: Proper cleanup of listeners

## 🔄 Future Enhancements

- **Push Notifications**: Real-time messaging alerts
- **Video Calling**: WebRTC integration
- **Offline Support**: Offline-first architecture
- **Analytics**: User behavior tracking
- **A/B Testing**: Feature flag system

## 📄 License

This project is proprietary and confidential.

---

**Ready to build the future of dating? This React Native frontend provides the perfect foundation!** 💕