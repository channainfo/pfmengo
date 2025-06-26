# Architecture Overview

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Applications                      │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   iOS App       │   Android App   │      Web App (Future)       │
│ (React Native)  │ (React Native)  │  (React/Next.js)           │
└────────┬────────┴────────┬────────┴───────┬────────────────────┘
         │                 │                │
         └─────────────────┴────────────────┘
                           │
                    Load Balancer
                  (AWS ALB/Nginx)
                           │
┌──────────────────────────┴──────────────────────────────────────┐
│                      API Gateway                                 │
│                  (AWS API Gateway)                               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────────┐
│                    Microservices Layer                           │
├─────────────┬──────────────┬────────────┬──────────────────────┤
│   Auth      │   Matching   │   Chat     │    Media             │
│  Service    │   Service    │  Service   │   Service            │
│ (NestJS)    │ (Python)     │ (Node.js)  │    (Go)              │
├─────────────┼──────────────┼────────────┼──────────────────────┤
│  Profile    │   Events     │  Payment   │   Notification       │
│  Service    │   Service    │  Service   │   Service            │
│ (NestJS)    │  (NestJS)    │ (NestJS)   │   (Node.js)          │
└─────────────┴──────────────┴────────────┴──────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────────┐
│                     Data Layer                                   │
├─────────────┬──────────────┬────────────┬──────────────────────┤
│ PostgreSQL  │    Redis     │ MongoDB    │  Elasticsearch       │
│  (Primary)  │  (Cache)     │ (Chat)     │   (Search)           │
└─────────────┴──────────────┴────────────┴──────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────────┐
│                   External Services                              │
├─────────────┬──────────────┬────────────┬──────────────────────┤
│   AWS S3    │   SendGrid   │  Stripe    │    Twilio            │
│  (Storage)  │   (Email)    │ (Payments) │  (SMS/Video)         │
└─────────────┴──────────────┴────────────┴──────────────────────┘
```

## Backend Architecture (NestJS)

### Module Structure

```
src/
├── auth/                    # Authentication & Authorization
│   ├── strategies/          # Passport strategies
│   ├── guards/              # Auth guards
│   ├── decorators/          # Custom decorators
│   └── dto/                 # Data transfer objects
├── common/                  # Shared utilities
│   ├── decorators/          # Common decorators
│   ├── filters/             # Exception filters
│   ├── guards/              # Common guards
│   ├── interceptors/        # HTTP interceptors
│   └── pipes/               # Validation pipes
├── config/                  # Configuration
│   ├── database.config.ts   # Database configuration
│   ├── redis.config.ts      # Redis configuration
│   └── app.config.ts        # Application configuration
├── database/                # Database layer
│   ├── entities/            # TypeORM entities
│   ├── migrations/          # Database migrations
│   └── seeds/               # Database seeders
├── modules/                 # Feature modules
│   ├── users/               # User management
│   ├── profiles/            # Profile management
│   ├── matching/            # Matching algorithms
│   ├── chat/                # Real-time messaging
│   ├── events/              # Event management (Spark)
│   ├── payments/            # Payment processing
│   └── notifications/       # Push notifications
└── types/                   # TypeScript types
```

### Service Architecture Pattern

Each service follows a consistent pattern:

```typescript
// Service Structure
service/
├── service.controller.ts    # HTTP endpoints
├── service.service.ts       # Business logic
├── service.module.ts        # Module definition
├── dto/                     # Data transfer objects
│   ├── create.dto.ts
│   └── update.dto.ts
├── entities/                # Database entities
│   └── entity.ts
└── interfaces/              # TypeScript interfaces
    └── service.interface.ts
```

## Frontend Architecture (React Native)

### Application Structure

```
mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Shared components
│   │   ├── spark/           # Spark-specific components
│   │   ├── connect/         # Connect-specific components
│   │   └── forever/         # Forever-specific components
│   ├── screens/             # Screen components
│   │   ├── auth/            # Authentication screens
│   │   ├── spark/           # Spark tier screens
│   │   ├── connect/         # Connect tier screens
│   │   ├── forever/         # Forever tier screens
│   │   └── shared/          # Shared screens
│   ├── navigation/          # Navigation configuration
│   │   ├── AppNavigator.tsx # Main navigator
│   │   └── MainTabNavigator.tsx # Tab navigator
│   ├── store/               # Redux store
│   │   ├── slices/          # Redux slices
│   │   └── index.ts         # Store configuration
│   ├── services/            # API services
│   │   ├── api.ts           # API client
│   │   └── websocket.ts     # WebSocket client
│   ├── types/               # TypeScript types
│   ├── constants/           # App constants
│   └── utils/               # Utility functions
├── assets/                  # Static assets
└── App.tsx                  # Root component
```

### State Management Architecture

```typescript
// Redux Store Structure
{
  auth: {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  },
  profile: {
    currentProfile: Profile | null;
    viewedProfile: Profile | null;
    photos: ProfilePhoto[];
    isLoading: boolean;
    isUploading: boolean;
    error: string | null;
  },
  matching: {
    dailyMatches: Match[];
    tonightMatches: Match[];
    events: SparkEvent[];
    tonightEvents: SparkEvent[];
    compatibilityReport: CompatibilityReport | null;
    isLoading: boolean;
    error: string | null;
  },
  chat: {
    conversations: Conversation[];
    currentConversation: Conversation | null;
    messages: Message[];
    isLoading: boolean;
    isLoadingMessages: boolean;
    error: string | null;
  },
  ui: {
    theme: TierTheme;
    isTabBarVisible: boolean;
    activeModal: string | null;
    notifications: Notification[];
  }
}
```

## Database Architecture

### PostgreSQL Schema Design Principles

1. **Tier Separation**: Separate tables for tier-specific data
2. **Polymorphic Design**: Base tables with tier extensions
3. **Audit Trail**: Created/updated timestamps on all tables
4. **Soft Deletes**: Status fields instead of hard deletes
5. **UUID Primary Keys**: For distributed system compatibility

### MongoDB Collections Design

Used for real-time and unstructured data:

1. **Messages**: Chat messages with flexible schema
2. **Sessions**: User session management
3. **Analytics**: Event tracking and user behavior
4. **Notifications**: Push notification queue

### Redis Cache Strategy

1. **User Sessions**: Active user sessions with TTL
2. **Match Queue**: Daily match generation queue
3. **Location Cache**: Geospatial data for Spark tier
4. **Rate Limiting**: API rate limit counters
5. **Real-time Status**: Online/offline user status

## Security Architecture

### Authentication Flow

```
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│ Client  │      │   API   │      │  Auth   │      │Database │
└────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘
     │                │                │                │
     │  Login Request │                │                │
     │───────────────>│                │                │
     │                │  Validate      │                │
     │                │───────────────>│                │
     │                │                │  Check User    │
     │                │                │───────────────>│
     │                │                │<───────────────│
     │                │  Generate JWT  │                │
     │                │<───────────────│                │
     │  Access Token  │                │                │
     │<───────────────│                │                │
     │                │                │                │
```

### Security Layers

1. **API Gateway**: Rate limiting, DDoS protection
2. **Authentication**: JWT with refresh tokens
3. **Authorization**: Role-based (tier-based) access control
4. **Data Encryption**: At rest and in transit
5. **Input Validation**: DTO validation with class-validator
6. **SQL Injection**: Parameterized queries with TypeORM
7. **XSS Protection**: Input sanitization
8. **CORS**: Configured for allowed origins

## Scalability Architecture

### Horizontal Scaling Strategy

1. **Microservices**: Independent scaling of services
2. **Load Balancing**: AWS ALB or Nginx
3. **Database Sharding**: By user_id for user data
4. **Read Replicas**: For read-heavy operations
5. **CDN**: CloudFront for static assets
6. **Queue System**: RabbitMQ for async processing

### Caching Strategy

```
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│ Client  │      │   CDN   │      │  Redis  │      │Database │
└────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘
     │                │                │                │
     │  Request       │                │                │
     │───────────────>│                │                │
     │                │  Cache Miss    │                │
     │                │───────────────>│                │
     │                │                │  Cache Miss    │
     │                │                │───────────────>│
     │                │                │<───────────────│
     │                │  Store in Cache│                │
     │                │<───────────────│                │
     │  Response      │                │                │
     │<───────────────│                │                │
```

## Deployment Architecture

### Container Strategy

```yaml
# Docker Compose Services
services:
  api:
    build: .
    replicas: 3
    
  matching-service:
    build: ./services/matching
    replicas: 2
    
  chat-service:
    build: ./services/chat
    replicas: 2
    
  postgres:
    image: postgres:15
    
  redis:
    image: redis:7
    
  mongodb:
    image: mongo:6
```

### Kubernetes Architecture (Future)

```
┌─────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                        │
├─────────────────────┬───────────────────────────────────────┤
│   Ingress          │           Pods                          │
│   Controller       ├───────────────────────────────────────┤
│                    │  api-deployment (3 replicas)           │
│                    │  matching-deployment (2 replicas)      │
│                    │  chat-deployment (2 replicas)          │
│                    │  media-deployment (2 replicas)         │
├────────────────────┼───────────────────────────────────────┤
│   Services         │  Persistent Volumes                     │
│                    │  - PostgreSQL PV                        │
│                    │  - MongoDB PV                           │
│                    │  - Redis PV                             │
└────────────────────┴───────────────────────────────────────┘
```

## Monitoring Architecture

### Observability Stack

1. **Application Monitoring**: DataDog APM
2. **Error Tracking**: Sentry
3. **Logs**: ELK Stack (Elasticsearch, Logstash, Kibana)
4. **Metrics**: Prometheus + Grafana
5. **Uptime Monitoring**: Pingdom
6. **User Analytics**: Mixpanel

### Key Metrics

```
Application Metrics:
- API response times
- Error rates
- Database query performance
- Cache hit rates

Business Metrics:
- User registration rate
- Match success rate
- Message engagement
- Tier conversion rates

Infrastructure Metrics:
- CPU/Memory usage
- Network throughput
- Disk I/O
- Container health
```

## CI/CD Architecture

### Pipeline Stages

```
┌───────┐    ┌───────┐    ┌───────┐    ┌───────┐    ┌───────┐
│ Code  │────│ Build │────│ Test  │────│Deploy │────│Monitor│
│Commit │    │       │    │       │    │       │    │       │
└───────┘    └───────┘    └───────┘    └───────┘    └───────┘
    │            │            │            │            │
    │            │            │            │            │
 GitHub      Docker      Jest/Cypress   K8s/ECS     DataDog
             Build       Unit/E2E       Rolling      APM
                        Tests          Update
```

### Environment Strategy

1. **Development**: Local Docker Compose
2. **Staging**: AWS ECS with RDS
3. **Production**: AWS ECS with Multi-AZ RDS
4. **DR**: Cross-region replication

## Data Flow Architecture

### Match Generation Flow (Connect/Forever)

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Cron   │────│Matching │────│   ML    │────│Database │
│  Job    │    │Service  │    │ Engine  │    │         │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │
     │   Trigger    │              │              │
     │─────────────>│              │              │
     │              │  Get Users   │              │
     │              │─────────────────────────────>│
     │              │<─────────────────────────────│
     │              │              │              │
     │              │  Calculate   │              │
     │              │─────────────>│              │
     │              │<─────────────│              │
     │              │              │              │
     │              │  Store Matches              │
     │              │─────────────────────────────>│
```

### Real-time Chat Architecture

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Client  │────│Socket.io│────│  Redis  │────│ MongoDB │
│   App   │    │ Server  │    │ PubSub  │    │         │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │
     │   Connect    │              │              │
     │─────────────>│              │              │
     │              │  Subscribe   │              │
     │              │─────────────>│              │
     │              │              │              │
     │   Message    │              │              │
     │─────────────>│              │              │
     │              │   Publish    │              │
     │              │─────────────>│              │
     │              │              │   Store      │
     │              │              │─────────────>│
     │              │  Broadcast   │              │
     │              │<─────────────│              │
     │   Receive    │              │              │
     │<─────────────│              │              │
```

This architecture is designed to be scalable, maintainable, and secure while supporting the unique requirements of each tier in the dating app.