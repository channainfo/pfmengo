# Three-Tier Dating App - NestJS Backend

A revolutionary dating application backend built with NestJS that addresses different relationship goals through three distinct tiers: Spark (casual dating), Connect (serious relationships), and Forever (marriage-focused).

## Project Overview

This NestJS backend provides a robust, scalable API for a dating app that solves the fundamental problem of mixed intentions on traditional dating platforms by creating separate, purpose-built experiences for users with different relationship goals.

### Key Features

- **Three Distinct Tiers**: Separate API endpoints and business logic for casual dating, serious relationships, and marriage-minded individuals
- **Tier-Based Authentication**: JWT authentication with tier-specific access controls
- **Type-Safe Development**: Full TypeScript implementation with strict typing
- **Swagger Documentation**: Auto-generated API documentation
- **Database Agnostic**: TypeORM with PostgreSQL, easily configurable for other databases
- **Security First**: Rate limiting, input validation, and secure authentication
- **Microservices Ready**: Modular architecture that can be easily split into microservices

## Documentation

### Design & Planning
- [Wireframes & UI/UX Design](./docs/wireframes-ui-design.md) - Complete mobile wireframes and design system for all three tiers
- [Go-to-Market Strategy](./docs/go-to-market-strategy.md) - Comprehensive launch plan, marketing strategies, and growth tactics

### Technical Documentation
- [Technical Implementation](./docs/technical-implementation.md) - System architecture, microservices design, and technology stack
- [Database Schema](./docs/database-schema.md) - Complete PostgreSQL, MongoDB, and Redis schemas with privacy compliance

## Technology Stack

### Backend Framework
- **NestJS**: Modern Node.js framework with TypeScript
- **TypeORM**: Object-Relational Mapping with PostgreSQL
- **Passport.js**: Authentication middleware
- **JWT**: JSON Web Tokens for stateless authentication
- **Swagger**: API documentation generation

### Database
- **PostgreSQL**: Primary database for user data and relationships
- **Redis**: Caching and session management
- **MongoDB**: Real-time chat and messaging (planned)

### Development Tools
- **TypeScript**: Type-safe development
- **ESLint + Prettier**: Code formatting and linting
- **Jest**: Unit and integration testing
- **Docker**: Containerization for development and deployment

## Tier Overview

### 🔥 Spark (Casual Dating)
```typescript
@RequiredTiers(TierType.SPARK)
class SparkController {
  // Tonight mode endpoints
  // Event management
  // Quick matching
  // Stories and ephemeral content
}
```

### 💝 Connect (Serious Relationships)
```typescript
@RequiredTiers(TierType.CONNECT)
class ConnectController {
  // Daily curated matches
  // Compatibility scoring
  // Video dating
  // Deep conversation tools
}
```

### 💍 Forever (Marriage-Focused)
```typescript
@RequiredTiers(TierType.FOREVER)
class ForeverController {
  // Comprehensive profiles
  // Background verification
  // Family planning tools
  // Long-term compatibility
}
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker & Docker Compose (recommended)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourcompany/dating-app.git
cd dating-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials and API keys
```

4. **Start services with Docker**
```bash
docker-compose up -d
```

5. **Run database migrations**
```bash
npm run migration:run
```

6. **Start development server**
```bash
npm run start:dev
```

### API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/api/v1/health

## Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── dto/                # Data transfer objects
│   ├── auth.controller.ts  # Auth endpoints
│   ├── auth.service.ts     # Auth business logic
│   ├── auth.module.ts      # Auth module definition
│   └── jwt.strategy.ts     # JWT authentication strategy
├── common/                  # Shared utilities
│   ├── decorators/         # Custom decorators (tier restrictions)
│   └── guards/             # Guards (JWT, tier access)
├── config/                  # Configuration files
│   └── database.config.ts  # Database configuration
├── database/               # Database entities and migrations
│   └── entities/           # TypeORM entities
├── modules/                # Feature modules
│   ├── users/              # User management
│   ├── profiles/           # Profile management
│   ├── matching/           # Matching algorithms
│   └── events/             # Event management (Spark tier)
├── types/                  # TypeScript type definitions
│   └── tier.enum.ts        # Tier-related types
├── app.module.ts           # Main application module
└── main.ts                 # Application entry point
```

## API Endpoints

### Authentication
```
POST /api/v1/auth/register  # Register with tier selection
POST /api/v1/auth/login     # Login and get JWT token
```

### Profile Management
```
GET    /api/v1/profiles/me          # Get current user profile
PUT    /api/v1/profiles/basic       # Update basic profile
PUT    /api/v1/profiles/spark       # Update Spark-specific data
PUT    /api/v1/profiles/connect     # Update Connect-specific data
PUT    /api/v1/profiles/forever     # Update Forever-specific data
POST   /api/v1/profiles/media       # Upload photos/videos
DELETE /api/v1/profiles/media/:id   # Delete media
```

### Matching System
```
GET  /api/v1/matching/daily     # Daily matches (Connect/Forever)
GET  /api/v1/matching/tonight   # Tonight mode (Spark only)
POST /api/v1/matching/like      # Like a user
POST /api/v1/matching/pass      # Pass on a user
POST /api/v1/matching/super-like # Super like (premium)
```

### Events (Spark Tier Only)
```
GET  /api/v1/events           # Get nearby events
GET  /api/v1/events/tonight   # Tonight mode events
POST /api/v1/events/create    # Create new event
POST /api/v1/events/:id/join  # Join event
POST /api/v1/events/:id/leave # Leave event
```

## Tier-Based Access Control

The application uses a sophisticated tier-based access control system:

```typescript
// Example: Decorator usage for tier restrictions
@UseGuards(TierGuard)
@RequiredTiers(TierType.SPARK, TierType.CONNECT)
async someEndpoint() {
  // Only accessible by Spark and Connect tier users
}
```

### Tier Features Matrix

| Feature | Spark | Connect | Forever |
|---------|-------|---------|---------|
| Basic Matching | ✅ | ✅ | ✅ |
| Daily Curated Matches | ❌ | ✅ | ✅ |
| Events System | ✅ | ✅ | ❌ |
| Video Profiles | ❌ | ✅ | ✅ |
| Background Checks | ❌ | ❌ | ✅ |
| AI Relationship Coach | ❌ | ✅ | ✅ |
| Detailed Compatibility | ❌ | ✅ | ✅ |

## Development

### Running Tests
```bash
# Unit tests
npm run test

# Integration tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Database Operations
```bash
# Generate migration
npm run migration:generate

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run build
```

## Deployment

### Docker Production Build
```bash
# Build production image
docker build -t dating-app-api .

# Run production container
docker run -p 3000:3000 dating-app-api
```

### Environment Variables

Key environment variables for production:

```env
# Database
DB_HOST=your-db-host
DB_PASSWORD=your-secure-password

# Security
JWT_SECRET=your-super-secret-jwt-key

# External Services
AWS_ACCESS_KEY_ID=your-aws-key
STRIPE_SECRET_KEY=your-stripe-key
```

## Contributing

This is currently a private project. Contributing guidelines will be added when the project becomes open source.

## License

All rights reserved. This project is proprietary and confidential.

---

**Ready to launch your three-tier dating app? This NestJS backend provides the solid foundation you need!** 🚀