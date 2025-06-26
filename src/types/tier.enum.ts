export enum TierType {
  SPARK = 'spark',
  CONNECT = 'connect',
  FOREVER = 'forever',
}

export interface TierFeatures {
  maxDailyLikes: number;
  hasVideoProfiles: boolean;
  hasEvents: boolean;
  hasBackgroundCheck: boolean;
  hasAICoach: boolean;
  hasDetailedProfiles: boolean;
}

export const TIER_FEATURES: Record<TierType, TierFeatures> = {
  [TierType.SPARK]: {
    maxDailyLikes: 50,
    hasVideoProfiles: false,
    hasEvents: true,
    hasBackgroundCheck: false,
    hasAICoach: false,
    hasDetailedProfiles: false,
  },
  [TierType.CONNECT]: {
    maxDailyLikes: 20,
    hasVideoProfiles: true,
    hasEvents: true,
    hasBackgroundCheck: false,
    hasAICoach: true,
    hasDetailedProfiles: true,
  },
  [TierType.FOREVER]: {
    maxDailyLikes: 10,
    hasVideoProfiles: true,
    hasEvents: false,
    hasBackgroundCheck: true,
    hasAICoach: true,
    hasDetailedProfiles: true,
  },
};