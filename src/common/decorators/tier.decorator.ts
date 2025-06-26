import { SetMetadata } from '@nestjs/common';
import { TierType } from '../../types/tier.enum';

export const TIER_KEY = 'tiers';
export const RequiredTiers = (...tiers: TierType[]) => SetMetadata(TIER_KEY, tiers);