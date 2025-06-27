# Three-Tier Dating App

A revolutionary dating application that solves the problem of mixed intentions on traditional dating platforms by creating three distinct, purpose-built experiences for users with different relationship goals.

## 🎯 Project Overview

This dating app addresses the fundamental challenge of modern dating apps where users with vastly different intentions - from casual hookups to marriage - are mixed together, creating confusion and poor experiences. Our solution: **Three completely separate tiers** with distinct features, algorithms, and user experiences.

### The Three Tiers

- **🔥 Spark** - For casual dating and spontaneous connections
- **💝 Connect** - For those seeking serious, meaningful relationships  
- **💍 Forever** - For marriage-minded individuals ready for lifetime commitment

## 📚 Documentation

### Planning & Design

- [**Project Summary**](./docs/project-summary.md) - Executive overview and current status
- [**Wireframes & UI/UX Design**](./docs/wireframes-ui-design.md) - Complete mobile wireframes and design system for all three tiers
- [**Go-to-Market Strategy**](./docs/go-to-market-strategy.md) - Comprehensive launch plan, marketing strategies, and growth tactics
- [**Features and Suggestions**](./docs/features-and-suggestions.md) - Complete feature list with implementation status and future suggestions

### Technical Documentation

- [**Technical Implementation**](./docs/technical-implementation.md) - System architecture, microservices design, and technology stack
- [**Database Schema**](./docs/database-schema.md) - Complete PostgreSQL, MongoDB, and Redis schemas with privacy compliance
- [**Architecture Overview**](./docs/architecture-overview.md) - Detailed system architecture, data flows, and deployment strategies

### API Documentation

- **Swagger UI**: Available at `http://localhost:3000/api-docs` when running the backend
- **Postman Collection**: Coming soon

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- MongoDB 5+
- Docker & Docker Compose
- iOS/Android development environment for mobile

### Backend Setup (NestJS)

```bash
# Clone the repository
git clone https://github.com/yourcompany/three-tier-dating.git
cd three-tier-dating

# Install backend dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start services with Docker
docker-compose up -d

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

Backend will be available at `http://localhost:3000`

### Frontend Setup (React Native)

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 🏗 Project Structure

```txt
three-tier-dating/
├── src/                    # NestJS backend source code
│   ├── auth/              # Authentication module
│   ├── modules/           # Feature modules
│   ├── common/            # Shared utilities
│   └── database/          # Database entities
├── mobile/                 # React Native frontend
│   ├── src/               # Mobile app source code
│   └── assets/            # Mobile assets
├── docs/                   # Documentation
│   ├── wireframes-ui-design.md
│   ├── technical-implementation.md
│   ├── database-schema.md
│   ├── go-to-market-strategy.md
│   └── features-and-suggestions.md
├── docker-compose.yml      # Docker services configuration
└── README.md              # This file
```

## ✨ Key Features by Tier

### 🔥 Spark (Casual Dating)

- **Tonight Mode**: Find people available for spontaneous meetups
- **Swipe Interface**: Quick, fun matching based on attraction
- **Local Events**: Browse and join singles events nearby
- **Ephemeral Stories**: 24-hour disappearing content
- **Group Hangouts**: Connect with friend groups
- **Vibe Matching**: Music and mood-based connections

### 💝 Connect (Serious Relationships)

- **Daily Curated Matches**: Quality over quantity (5 matches/day)
- **Compatibility Algorithm**: Deep matching based on values and goals
- **Video Dating**: Built-in video calls for virtual dates
- **Conversation Depth**: AI-powered conversation starters
- **Two-Week Rule**: Chat for 2 weeks before meeting
- **Relationship Coach**: AI guidance for building connections

### 💍 Forever (Marriage-Focused)

- **Comprehensive Profiles**: Detailed life goals and values
- **Video Interviews**: Structured compatibility assessments
- **Reference System**: Friends and family can vouch for you
- **Background Checks**: Optional verification for safety
- **Life Planning**: 5-year goal alignment tools
- **Family Introduction**: Controlled family member access

## 🛡 Safety Features (All Tiers)

- Photo and profile verification
- AI-powered inappropriate content detection
- In-app reporting and blocking
- Date check-in system
- Emergency contact integration
- Background check options (Forever tier)

## 💰 Monetization Strategy

### Subscription Tiers

| Feature | Spark Free | Spark Premium | Connect | Forever |
|---------|------------|---------------|---------|---------|
| Daily Likes | 50 | Unlimited | 20 | 10 |
| See Who Liked You | ❌ | ✅ | ✅ | ✅ |
| Advanced Filters | ❌ | ✅ | ✅ | ✅ |
| Video Calls | ❌ | ❌ | ✅ | ✅ |
| AI Coach | ❌ | ❌ | ✅ | ✅ |
| Background Check | ❌ | ❌ | ❌ | ✅ |
| Price | Free | $9.99/mo | $19.99/mo | $29.99/mo |

## 🔧 Technology Stack

### Backend

- **Framework**: NestJS (Node.js + TypeScript)
- **Databases**: PostgreSQL (primary), Redis (cache), MongoDB (chat)
- **Authentication**: JWT with Passport.js
- **API**: RESTful with Swagger documentation
- **Real-time**: Socket.io for chat and notifications

### Frontend

- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit with Redux Persist
- **Navigation**: React Navigation 6
- **UI**: Custom components with tier-specific themes
- **API Client**: Axios with interceptors

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Cloud**: AWS (planned)
- **CI/CD**: GitHub Actions (planned)
- **Monitoring**: DataDog/Sentry (planned)

## 📈 Success Metrics

### User Metrics

- **User Acquisition Cost**: Target < $5
- **Monthly Active Users**: 20%+ growth
- **Gender Balance**: Within 60/40 ratio
- **Tier Distribution**: 50% Spark, 35% Connect, 15% Forever

### Engagement Metrics

- **Daily Active Users**: 40%+ for Spark, 30%+ for Connect, 25%+ for Forever
- **Match-to-Date Conversion**: 15%+ overall
- **User Retention (3-month)**: 40%+
- **Messages per Match**: 20+ for Connect/Forever

### Business Metrics

- **Paid Conversion**: 15%+ for Spark, 40%+ for Connect, 80%+ for Forever
- **Average Revenue per User**: $15+ monthly
- **Churn Rate**: < 10% monthly
- **Success Stories**: 100+ per month

## 🗺 Roadmap

### Phase 1: MVP (Current)

- ✅ Basic authentication and profiles
- ✅ Tier-based navigation
- ✅ Core matching functionality
- ✅ Basic chat system
- 🔄 Photo upload and verification

### Phase 2: Beta (Next 3 months)

- [ ] Video calling integration
- [ ] AI matching algorithms
- [ ] Event system for Spark
- [ ] Compatibility reports for Connect
- [ ] Interview system for Forever

### Phase 3: Launch (6 months)

- [ ] Push notifications
- [ ] Advanced safety features
- [ ] Payment integration
- [ ] Analytics dashboard
- [ ] Marketing automation

### Phase 4: Growth (9-12 months)

- [ ] International expansion
- [ ] AI relationship coach
- [ ] VR dating experiences
- [ ] Advanced gamification
- [ ] B2B partnerships

## 🤝 Contributing

This is currently a private project. Contributing guidelines will be added when the project becomes open source.

### Development Guidelines

- Follow TypeScript best practices
- Write unit tests for new features
- Update documentation for API changes
- Use conventional commits
- Create feature branches

## 📄 License

All rights reserved. This project is proprietary and confidential.

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- Expo team for simplifying React Native development
- Our future users for believing in purposeful dating

## 📞 Contact

For inquiries about this project:

- Email: <contact@threetiersdating.com>
- Website: Coming soon

## Troubleshooting

### Error: EMFILE: too many open files, watch

This is a common macOS issue where the system runs out of file descriptors for file watching. Let me fix this for you:

```sh
sudo launchctl limit maxfiles

ulimit -n 65536
npm start
```

---

**Built with ❤️ to revolutionize online dating by creating purposeful connections.**
