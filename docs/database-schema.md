# Database Schema

## PostgreSQL Schema Design

### Core User Tables

```sql
-- Core User Tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    tier ENUM('spark', 'connect', 'forever') NOT NULL,
    tier_switched_at TIMESTAMP,
    status ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Profiles (Polymorphic by Tier)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tier ENUM('spark', 'connect', 'forever') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100), -- Only for Forever tier
    birth_date DATE NOT NULL,
    gender ENUM('male', 'female', 'non_binary', 'other'),
    location GEOGRAPHY(POINT, 4326),
    city VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);
```

### Tier-Specific Profile Tables

```sql
-- Spark-specific Profile Data
CREATE TABLE spark_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    current_vibe VARCHAR(50),
    tonight_status VARCHAR(200),
    last_active TIMESTAMP,
    stories JSONB, -- Array of story objects
    UNIQUE(profile_id)
);

-- Connect-specific Profile Data
CREATE TABLE connect_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    occupation VARCHAR(200),
    education VARCHAR(200),
    values JSONB, -- Ranked values array
    life_goals JSONB,
    personality_type VARCHAR(10),
    relationship_timeline VARCHAR(50),
    wants_children BOOLEAN,
    children_count_desired INTEGER,
    UNIQUE(profile_id)
);

-- Forever-specific Profile Data
CREATE TABLE forever_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    full_name VARCHAR(200),
    occupation_detail TEXT,
    education_detail TEXT,
    income_bracket VARCHAR(50),
    family_background TEXT,
    faith VARCHAR(100),
    faith_importance ENUM('very', 'moderate', 'low'),
    financial_philosophy TEXT,
    health_lifestyle TEXT,
    five_year_plan TEXT,
    references JSONB, -- Array of reference contacts
    background_check_status ENUM('pending', 'completed', 'failed'),
    background_check_date TIMESTAMP,
    UNIQUE(profile_id)
);
```

### Media & Verification

```sql
-- Media Storage
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    media_type ENUM('photo', 'video', 'audio'),
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    is_primary BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    order_index INTEGER,
    metadata JSONB, -- Duration, dimensions, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verification System
CREATE TABLE verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    verification_type ENUM('email', 'phone', 'photo', 'id', 'social'),
    status ENUM('pending', 'verified', 'failed'),
    verified_at TIMESTAMP,
    metadata JSONB, -- Additional verification data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Matching System

```sql
-- Matching System
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tier ENUM('spark', 'connect', 'forever') NOT NULL,
    match_score DECIMAL(5,2),
    compatibility_data JSONB, -- Tier-specific compatibility details
    status ENUM('pending', 'matched', 'expired', 'unmatched'),
    matched_at TIMESTAMP,
    expires_at TIMESTAMP, -- For Spark tier
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user1_id, user2_id),
    CHECK (user1_id < user2_id) -- Ensure consistent ordering
);

-- User Actions/Swipes
CREATE TABLE user_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action ENUM('like', 'super_like', 'pass'),
    tier ENUM('spark', 'connect', 'forever') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_user_id)
);
```

### Chat System

```sql
-- Chat System
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    tier ENUM('spark', 'connect', 'forever') NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP,
    message_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);
```

### Events (Spark Tier)

```sql
-- Events (Spark Tier)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(50),
    location GEOGRAPHY(POINT, 4326),
    venue_name VARCHAR(200),
    starts_at TIMESTAMP NOT NULL,
    ends_at TIMESTAMP,
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id),
    status ENUM('upcoming', 'active', 'completed', 'cancelled'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status ENUM('interested', 'attending', 'attended', 'no_show'),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);
```

### Subscription & Analytics

```sql
-- Subscription Management
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tier ENUM('spark', 'connect', 'forever') NOT NULL,
    plan_type ENUM('free', 'premium', 'vip', 'elite', 'platinum'),
    stripe_subscription_id VARCHAR(255),
    status ENUM('active', 'cancelled', 'expired', 'past_due'),
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Analytics & Behavior Tracking
CREATE TABLE user_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(100),
    event_data JSONB,
    tier ENUM('spark', 'connect', 'forever'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Safety & Reporting

```sql
-- Safety & Reporting
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES users(id),
    reported_user_id UUID REFERENCES users(id),
    report_type ENUM('inappropriate', 'harassment', 'fake_profile', 'spam', 'other'),
    description TEXT,
    evidence JSONB, -- Screenshots, message IDs, etc.
    status ENUM('pending', 'investigating', 'resolved', 'dismissed'),
    resolution TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);
```

### Indexes for Performance

```sql
-- Indexes for Performance
CREATE INDEX idx_users_tier ON users(tier);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_profiles_location ON profiles USING GIST(location);
CREATE INDEX idx_matches_users ON matches(user1_id, user2_id);
CREATE INDEX idx_matches_status_tier ON matches(status, tier);
CREATE INDEX idx_user_actions_created ON user_actions(created_at);
CREATE INDEX idx_events_starts_at ON events(starts_at);
CREATE INDEX idx_events_location ON events USING GIST(location);
```

## MongoDB Schema (Chat & Real-time Data)

### Messages Collection

```javascript
{
  _id: ObjectId,
  conversation_id: UUID, // References PostgreSQL conversation
  sender_id: UUID,
  recipient_id: UUID,
  message_type: "text" | "image" | "video" | "audio" | "gif",
  content: {
    text: String,
    media_url: String,
    thumbnail_url: String,
    duration: Number // For audio/video
  },
  tier: "spark" | "connect" | "forever",
  read_at: Date,
  delivered_at: Date,
  created_at: Date,
  encrypted: Boolean,
  metadata: {
    reply_to: ObjectId, // Reference to another message
    reactions: [{
      user_id: UUID,
      emoji: String,
      created_at: Date
    }]
  }
}
```

### User Sessions Collection

```javascript
{
  _id: ObjectId,
  user_id: UUID,
  device_id: String,
  device_type: "ios" | "android" | "web",
  tier: "spark" | "connect" | "forever",
  last_active: Date,
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  session_data: {
    ip_address: String,
    user_agent: String,
    app_version: String
  },
  created_at: Date,
  expires_at: Date
}
```

### Real-time Status Collection

```javascript
{
  _id: ObjectId,
  user_id: UUID,
  tier: "spark" | "connect" | "forever",
  status: "online" | "away" | "offline",
  last_seen: Date,
  current_activity: {
    type: "browsing" | "chatting" | "video_call" | "event",
    details: Object
  },
  tonight_mode: { // Spark only
    active: Boolean,
    activity: String,
    expires_at: Date
  }
}
```

## Redis Cache Structure

```redis
# User Cache
user:{user_id} = {
  id: UUID,
  tier: string,
  profile_data: JSON,
  verification_status: JSON,
  subscription: JSON,
  ttl: 3600 // 1 hour
}

# Active Matches Cache
matches:{user_id} = [
  {
    match_id: UUID,
    other_user_id: UUID,
    score: number,
    matched_at: timestamp
  }
]

# Daily Match Queue (Connect/Forever)
daily_matches:{tier}:{date} = SET of user_ids

# Location-based Cache (Spark)
location:{geohash} = SET of active_user_ids

# Event Attendees Cache
event:{event_id}:attendees = SET of user_ids

# Rate Limiting
rate_limit:{user_id}:{action} = counter with TTL
```

## Data Privacy & Compliance

### GDPR Compliance Tables

```sql
-- GDPR Compliance Tables
CREATE TABLE data_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    request_type ENUM('access', 'deletion', 'portability'),
    status ENUM('pending', 'processing', 'completed'),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE consent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    consent_type VARCHAR(100),
    granted BOOLEAN,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action VARCHAR(100),
    resource_type VARCHAR(50),
    resource_id UUID,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Database Best Practices

### Data Retention
- Messages: 90 days for Spark, 1 year for Connect, Indefinite for Forever
- User data: Soft delete with 30-day recovery period
- Analytics: Aggregate after 180 days

### Backup Strategy
- PostgreSQL: Daily backups with 30-day retention
- MongoDB: Continuous replication with point-in-time recovery
- Redis: Snapshot every hour

### Scaling Considerations
- Horizontal sharding by user_id for messages
- Read replicas for analytics queries
- Separate clusters per tier for isolation

### Security Measures
- Encryption at rest for all databases
- TLS for all connections
- Row-level security for multi-tenant data
- Regular security audits and penetration testing