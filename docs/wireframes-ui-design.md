# Wireframes & UI/UX Design

## Overview
This document contains the complete wireframe designs and UI/UX specifications for the three-tier dating app system: Spark (casual), Connect (serious relationships), and Forever (marriage-focused).

## 🔥 SPARK TIER (Casual) - Mobile Wireframes

### Main Screens

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│     SPARK HOME      │  │   SPARK PROFILE     │  │    SPARK CHAT       │
├─────────────────────┤  ├─────────────────────┤  ├─────────────────────┤
│ ┌─────────────────┐ │  │ ┌─────────────────┐ │  │ < Back     Sarah    │
│ │                 │ │  │ │   Profile Pic    │ │  ├─────────────────────┤
│ │   Profile Pic   │ │  │ └─────────────────┘ │  │ ┌─────────────────┐ │
│ │                 │ │  │ Sarah, 25 📍2mi    │  │ │ Hey! Love your   │ │
│ └─────────────────┘ │  │ ⚡ "Out tonight!"    │  │ │ vibe 😊          │ │
│                     │  │ ─────────────────── │  │ └─────────────────┘ │
│ Sarah, 25 📍2 miles │  │ 🎵 Listening to:    │  │         ┌─────────┐ │
│ ⚡ "Out tonight!"   │  │ [Spotify Widget]    │  │         │ Same! 🔥│ │
│                     │  │ ─────────────────── │  │         └─────────┘ │
│ ┌─────┬─────┬─────┐ │  │ Tonight: Dancing @  │  │ ┌─────────────────┐ │
│ │ 😴  │ ⚡  │ ❤️  │ │  │ [Venue Name]        │  │ │ Quick Question: │ │
│ └─────┴─────┴─────┘ │  │ ─────────────────── │  │ │ Coffee or Drinks│ │
│  Pass  Vibe  Like  │  │ Stories:            │  │ │ [A]     [B]     │ │
└─────────────────────┘  │ [○][○][○][○]        │  │ └─────────────────┘ │
                         │ ─────────────────── │  │ ┌─────────────────┐ │
┌─────────────────────┐  │ Interests:          │  │ │ 📷 📎 😊  Send  │ │
│   TONIGHT MODE      │  │ #Dancing #Wine      │  │ └─────────────────┘ │
├─────────────────────┤  │ #Adventures         │  └─────────────────────┘
│ 🌙 Active Now: 847  │  └─────────────────────┘
│ ┌─────────────────┐ │  
│ │ [Map View]      │ │  ┌─────────────────────┐  ┌─────────────────────┐
│ │ • • • • •       │ │  │   SPARK EVENTS      │  │  SPARK STORIES      │
│ └─────────────────┘ │  ├─────────────────────┤  ├─────────────────────┤
│ ┌─────────────────┐ │  │ Tonight 🔥          │  │ ┌───┐┌───┐┌───┐┌───┐│
│ │ Speed Dating    │ │  │ ┌─────────────────┐ │  │ │You││ + ││...││...││
│ │ 8PM - 20 spots │ │  │ │ Wine & Paint     │ │  │ └───┘└───┘└───┘└───┘│
│ └─────────────────┘ │  │ │ 7PM • 12 joined │ │  │ ┌─────────────────┐ │
│ ┌─────────────────┐ │  │ └─────────────────┘ │  │ │                 │ │
│ │ Bar Crawl       │ │  │ ┌─────────────────┐ │  │ │  Sarah's Story  │ │
│ │ 9PM - 8 spots  │ │  │ │ Karaoke Night   │ │  │ │   "At the       │ │
│ └─────────────────┘ │  │ │ 8PM • 24 joined │ │  │ │   beach!"       │ │
└─────────────────────┘  │ └─────────────────┘ │  │ └─────────────────┘ │
                         └─────────────────────┘  └─────────────────────┘
```

### Spark Profile Structure
```
Spark Profile:
├── 3 Photos (required)
├── Current Vibe (mood/activity)
├── Tonight's Plan (optional)
├── Interests (max 5 tags)
├── Deal Breakers (max 3)
└── Instagram Integration
```

### Unique Features
- **"Tonight Mode"**: See who's available for spontaneous meetups
- **Ephemeral Profiles**: Profile updates expire after 48 hours
- **Quick Match**: 10-second video speed dating
- **Vibe Check**: Music/mood-based matching
- **Group Hangs**: Connect with friend groups for casual meetups
- **"Spark Stories"**: 24-hour stories showcasing lifestyle
- **"Adventure Mode"**: Suggests spontaneous date ideas
- **"Chemistry Test"**: Fun quiz games with matches
- **No Last Names**: First names only until mutual consent
- **"Fade Away"**: Matches expire after 7 days of no interaction

## 💝 CONNECT TIER (Serious) - Mobile Wireframes

### Main Screens

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│    CONNECT HOME     │  │  CONNECT PROFILE    │  │  COMPATIBILITY      │
├─────────────────────┤  ├─────────────────────┤  ├─────────────────────┤
│ Daily Matches (3)   │  │ ┌─────────────────┐ │  │ You & Michael       │
│ ┌─────────────────┐ │  │ │ Profile + Video │ │  │ ⭐ 87% Match        │
│ │   Michael, 29   │ │  │ └─────────────────┘ │  ├─────────────────────┤
│ │ ⭐ 87% Match    │ │  │ Michael, 29         │  │ Values Alignment:   │
│ │ ┌─────────────┐ │ │  │ Product Manager     │  │ ████████░░ 85%      │
│ │ │             │ │ │  │ ─────────────────── │  │                     │
│ │ │   Photo     │ │ │  │ 💭 "Looking for my  │  │ Life Goals:         │
│ │ │             │ │ │  │ partner in crime"   │  │ █████████░ 90%      │
│ │ └─────────────┘ │ │  │ ─────────────────── │  │                     │
│ │ Values: Family  │ │  │ Core Values:        │  │ Personality:        │
│ │ Goals: Marriage │ │  │ 1. Family First     │  │ ████████░░ 82%      │
│ └─────────────────┘ │  │ 2. Career Growth    │  │                     │
│ [Skip] [Connect]   │  │ 3. Adventure        │  │ Communication:      │
│ ─────────────────── │  │ ─────────────────── │  │ █████████░ 88%      │
│ ⏰ Next batch: 18h  │  │ Relationship Goals: │  │ ─────────────────── │
└─────────────────────┘  │ • Serious, marriage │  │ 🎯 Key Insights:    │
                         │ • Kids: Yes (2-3)   │  │ • Both value family │
┌─────────────────────┐  │ • Timeline: 2-3 yrs │  │ • Similar ambitions │
│  DEEP DIVE CHAT     │  │ ─────────────────── │  │ • Complementary     │
├─────────────────────┤  │ Personality:        │  │   personalities     │
│ < Back    Michael   │  │ INTJ - Architect    │  │ ─────────────────── │
│ Week 1 Questions    │  │ ─────────────────── │  │ [View Full Report]  │
├─────────────────────┤  │ [Unlock More ➕]     │  └─────────────────────┘
│ Today's Question:   │  └─────────────────────┘
│ "What does success │  
│ mean to you?"       │  ┌─────────────────────┐  ┌─────────────────────┐
│ ┌─────────────────┐ │  │  VIDEO DATE ROOM    │  │ RELATIONSHIP COACH  │
│ │ For me it's...  │ │  ├─────────────────────┤  ├─────────────────────┤
│ └─────────────────┘ │  │ ┌─────────────────┐ │  │ 🤖 AI Coach Says:   │
│         ┌─────────┐ │  │ │                 │ │  │ ┌─────────────────┐ │
│         │ Balance │ │  │ │   Your Video    │ │  │ │ Great progress! │ │
│         │ between │ │  │ │                 │ │  │ │ Try asking about│ │
│         │ work... │ │  │ └─────────────────┘ │  │ │ his family...   │ │
│         └─────────┘ │  │ ┌─────────────────┐ │  │ └─────────────────┘ │
│ ┌─────────────────┐ │  │ │                 │ │  │ Conversation Tips:  │
│ │ 💭 Type deeper..│ │  │ │ Michael's Video │ │  │ • Active listening  │
│ └─────────────────┘ │  │ │                 │ │  │ • Open questions    │
└─────────────────────┘  │ └─────────────────┘ │  │ • Share feelings    │
                         │ [🎤] [📹] [☎️] [❌]  │  └─────────────────────┘
                         └─────────────────────┘
```

### Connect Profile Structure
```
Connect Profile:
├── 5 Photos + 1 Video intro
├── Life Values (ranked)
├── Relationship Goals
├── Career & Ambitions
├── Hobbies & Passions
├── Deal Breakers & Must-Haves
├── Personality Assessment
└── Verified LinkedIn (optional)
```

### Unique Features
- **Compatibility Score**: Based on values, goals, lifestyle
- **"Slow Reveal"**: Unlock profile layers through conversation
- **Virtual Coffee Dates**: Built-in video dating
- **Relationship Readiness Quiz**: Mandatory assessment
- **"Deep Dive"**: Weekly thought-provoking questions
- **"Milestone Moments"**: Share life achievements
- **"Two-Week Rule"**: Must chat for 2 weeks before meeting
- **Compatibility Reports**: AI-generated relationship insights
- **"Couple Goals"**: See examples of successful matches
- **Relationship Coach**: AI guidance based on psychology

## 💍 FOREVER TIER (Marriage) - Mobile Wireframes

### Main Screens

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│   FOREVER HOME      │  │  FOREVER PROFILE    │  │  LIFE PLAN MATCH   │
├─────────────────────┤  ├─────────────────────┤  ├─────────────────────┤
│ Your Match Today    │  │ ┌─────────────────┐ │  │ Life Goals Timeline │
│ ┌─────────────────┐ │  │ │ Professional    │ │  │ Jennifer & You      │
│ │ Jennifer, 31    │ │  │ │ Photos (5)      │ │  ├─────────────────────┤
│ │ ✓ Verified      │ │  │ └─────────────────┘ │  │ Year 1-2:           │
│ │ ┌─────────────┐ │ │  │ Jennifer Chen, 31   │  │ ✓ Get married       │
│ │ │Professional │ │ │  │ Senior Consultant   │  │ ✓ Buy house         │
│ │ │   Photo     │ │ │  │ Harvard MBA         │  │                     │
│ │ └─────────────┘ │ │  │ ─────────────────── │  │ Year 3-4:           │
│ │ 💍 Ready for    │ │  │ 📍 San Francisco    │  │ ✓ First child       │
│ │    marriage     │ │  │ 🏛️ Catholic        │  │ ✓ Career growth     │
│ │ 👨‍👩‍👧‍👦 Wants 2-3  │ │  │ ─────────────────── │  │                     │
│ │ 📍 Flexible     │ │  │ Life Vision:        │  │ Year 5+:            │
│ └─────────────────┘ │  │ "Building a loving  │  │ ✓ Second child      │
│ [Review Full Prof.] │  │ family while making │  │ ✓ Travel goals      │
│ ─────────────────── │  │ positive impact"    │  │ ─────────────────── │
│ ⚡ 95% Compatible   │  │ ─────────────────── │  │ Financial Alignment:│
└─────────────────────┘  │ Family Background:  │  │ ████████░░ 92%      │
                         │ • Close-knit family │  │ Similar approaches  │
┌─────────────────────┐  │ • 2 siblings        │  │ to saving/investing │
│  FOREVER INTERVIEW  │  │ • Parents: 35 years │  └─────────────────────┘
├─────────────────────┤  │ ─────────────────── │
│ Structured Video    │  │ Financial Philosophy│  ┌─────────────────────┐
│ Interview - Phase 1 │  │ • Saver & Investor  │  │ REFERENCE VIDEOS    │
├─────────────────────┤  │ • Joint finances OK │  ├─────────────────────┤
│ Topics to Cover:    │  │ • $150-200k range   │  │ From her friends:   │
│ ✓ Family values     │  │ ─────────────────── │  │ ┌─────────────────┐ │
│ ✓ Career balance    │  │ Health & Lifestyle: │  │ │ "Jen is the     │ │
│ ⏱ Faith practices   │  │ • Active lifestyle  │  │ │ most loyal..."  │ │
│ ⏱ Parenting style   │  │ • No smoking/drugs  │  │ │ - Best Friend   │ │
│ ⏱ Conflict resolve  │  │ • Social drinker    │  │ └─────────────────┘ │
│ ─────────────────── │  │ ─────────────────── │  │ ┌─────────────────┐ │
│ Time: 25:30 / 45:00 │  │ References:         │  │ │ "Great person,  │ │
│ [Continue Interview]│  │ ✓ Sarah (Friend)    │  │ │ ready for..."   │ │
└─────────────────────┘  │ ✓ Mark (Colleague)  │  │ │ - Colleague     │ │
                         │ ─────────────────── │  │ └─────────────────┘ │
                         │ [Background Check ✓] │  └─────────────────────┘
                         └─────────────────────┘
```

### Forever Profile Structure
```
Forever Profile:
├── Professional Photos (5-7)
├── Video Introduction (2-3 min)
├── Life Timeline & Goals
├── Family Background
├── Financial Philosophy
├── Faith & Values (detailed)
├── Health & Lifestyle
├── References (2 required)
└── Background Check (optional)
```

### Unique Features
- **Complete Transparency**: Full profiles from start
- **Family Planning Section**: Kids, location, lifestyle
- **"Meet the Friends"**: Video intros from references
- **Financial Compatibility**: General income bracket, goals
- **Faith & Culture Matching**: Detailed preferences
- **"Forever Interview"**: Structured video conversations
- **Parent/Family Mode**: Family can view profiles (with consent)
- **"Life Plan Match"**: 5-year goal alignment
- **Pre-Marriage Course**: Unlock after 3 months
- **Success Coaching**: Professional relationship counselors

## Design System Overview

### Color Palettes
```
┌────────────┬────────────┬────────────┐
│   SPARK    │  CONNECT   │  FOREVER   │
├────────────┼────────────┼────────────┤
│ Primary:   │ Primary:   │ Primary:   │
│ #FF6B6B   │ #4ECDC4   │ #2C3E50   │
│ (Coral)    │ (Teal)     │ (Navy)     │
│            │            │            │
│ Secondary: │ Secondary: │ Secondary: │
│ #FFA502   │ #7B68EE   │ #E8B4B8   │
│ (Orange)   │ (Purple)   │ (Rose Gold)│
│            │            │            │
│ Accent:    │ Accent:    │ Accent:    │
│ #FFD93D   │ #95E1D3   │ #F8F9FA   │
│ (Yellow)   │ (Mint)     │ (Pearl)    │
└────────────┴────────────┴────────────┘
```

### Typography
- Headers: SF Pro Display (iOS) / Roboto (Android)
- Body: SF Pro Text (iOS) / Roboto (Android)
- Spark: Bold, playful weights
- Connect: Regular, clean weights
- Forever: Light, elegant weights

## Cross-Tier Features & Rules

### Tier Boundaries
- **No Cross-Tier Matching**: Users only see others in same tier
- **Tier Switching**: Can change tier once every 30 days
- **Verification Levels**: Higher tiers require more verification
- **Clear Badges**: Visual indicators of user's tier

### Universal Safety Features
- All tiers include video verification
- AI-powered inappropriate content detection
- In-app reporting and blocking
- Safety resources and guides

## UI/UX Differentiation

### Spark
- Vibrant colors (orange/red)
- Playful animations
- Quick swipe interface
- Instagram-like stories

### Connect
- Calming colors (blue/purple)
- Clean, thoughtful design
- Card-based profiles
- Focus on content over images

### Forever
- Elegant colors (gold/navy)
- Professional aesthetic
- Detailed portfolio view
- Emphasis on information

## Onboarding Flow

```
1. Welcome Screen
   └── "What brings you here?"
   
2. Tier Selection (with descriptions)
   ├── Spark: "Fun, casual connections"
   ├── Connect: "Meaningful relationships"
   └── Forever: "Finding your life partner"
   
3. Tier-Specific Questions
   ├── Spark: Availability, interests
   ├── Connect: Values, goals, personality
   └── Forever: Comprehensive questionnaire
   
4. Verification Level
   └── Required based on tier selection
   
5. Profile Creation
   └── Guided by tier requirements
```