import { Injectable } from '@nestjs/common';
import { TierType, TIER_FEATURES } from '../../types/tier.enum';
import { User } from '../../database/entities/user.entity';

interface MatchingCriteria {
  userId: string;
  tier: TierType;
  location?: { lat: number; lng: number };
  age?: { min: number; max: number };
  interests?: string[];
}

@Injectable()
export class MatchingService {
  async findMatches(criteria: MatchingCriteria): Promise<any[]> {
    const { tier } = criteria;
    
    switch (tier) {
      case TierType.SPARK:
        return this.findSparkMatches(criteria);
      case TierType.CONNECT:
        return this.findConnectMatches(criteria);
      case TierType.FOREVER:
        return this.findForeverMatches(criteria);
      default:
        throw new Error('Invalid tier');
    }
  }

  private async findSparkMatches(criteria: MatchingCriteria): Promise<any[]> {
    // Spark algorithm: Focus on location proximity and availability
    // Implementation would include:
    // - Nearby users (5-25 mile radius)
    // - Currently active users
    // - Shared interests
    // - Tonight mode compatibility
    
    return []; // Placeholder
  }

  private async findConnectMatches(criteria: MatchingCriteria): Promise<any[]> {
    // Connect algorithm: Compatibility-based matching
    // Implementation would include:
    // - Values alignment score
    // - Life goals compatibility
    // - Personality matching
    // - Career/education level
    
    return []; // Placeholder
  }

  private async findForeverMatches(criteria: MatchingCriteria): Promise<any[]> {
    // Forever algorithm: Long-term compatibility
    // Implementation would include:
    // - Family planning alignment
    // - Financial compatibility
    // - Faith/cultural values
    // - Life timeline matching
    // - Location flexibility
    
    return []; // Placeholder
  }

  async calculateCompatibilityScore(user1: User, user2: User): Promise<number> {
    const { tier } = user1;
    
    switch (tier) {
      case TierType.SPARK:
        return this.calculateSparkScore(user1, user2);
      case TierType.CONNECT:
        return this.calculateConnectScore(user1, user2);
      case TierType.FOREVER:
        return this.calculateForeverScore(user1, user2);
      default:
        return 0;
    }
  }

  private calculateSparkScore(user1: User, user2: User): number {
    // Quick attraction and availability scoring
    let score = 0;
    
    // Location proximity (40% weight)
    score += 40;
    
    // Shared interests (30% weight)
    score += 30;
    
    // Availability/activity level (30% weight)
    score += 30;
    
    return Math.min(score, 100);
  }

  private calculateConnectScore(user1: User, user2: User): number {
    // Comprehensive compatibility scoring
    let score = 0;
    
    // Values alignment (35% weight)
    score += 35;
    
    // Life goals (25% weight)
    score += 25;
    
    // Personality match (20% weight)
    score += 20;
    
    // Interests/lifestyle (20% weight)
    score += 20;
    
    return Math.min(score, 100);
  }

  private calculateForeverScore(user1: User, user2: User): number {
    // Long-term compatibility scoring
    let score = 0;
    
    // Family planning (30% weight)
    score += 30;
    
    // Financial alignment (25% weight)
    score += 25;
    
    // Values/faith (20% weight)
    score += 20;
    
    // Life timeline (15% weight)
    score += 15;
    
    // Location flexibility (10% weight)
    score += 10;
    
    return Math.min(score, 100);
  }

  async getDailyMatches(user: User): Promise<any[]> {
    const tierFeatures = TIER_FEATURES[user.tier];
    const maxMatches = user.tier === TierType.SPARK ? 20 : 
                      user.tier === TierType.CONNECT ? 5 : 3;

    const criteria: MatchingCriteria = {
      userId: user.id,
      tier: user.tier,
    };

    const matches = await this.findMatches(criteria);
    return matches.slice(0, maxMatches);
  }
}