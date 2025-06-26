import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../database/entities/profile.entity';
import { TierType } from '../../types/tier.enum';

interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
  bio?: string;
  interests?: string[];
  // Tier-specific fields would be handled separately
}

interface SparkProfileUpdate {
  currentVibe?: string;
  tonightStatus?: string;
  stories?: any[];
}

interface ConnectProfileUpdate {
  occupation?: string;
  education?: string;
  values?: string[];
  lifeGoals?: string[];
  personalityType?: string;
  relationshipTimeline?: string;
  wantsChildren?: boolean;
  childrenCountDesired?: number;
}

interface ForeverProfileUpdate {
  occupationDetail?: string;
  educationDetail?: string;
  incomeBracket?: string;
  familyBackground?: string;
  faith?: string;
  faithImportance?: 'very' | 'moderate' | 'low';
  financialPhilosophy?: string;
  healthLifestyle?: string;
  fiveYearPlan?: string;
  references?: any[];
}

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  async getProfile(userId: string): Promise<Profile> {
    const profile = await this.profilesRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async updateBasicProfile(userId: string, updateData: UpdateProfileDto): Promise<Profile> {
    const profile = await this.getProfile(userId);
    
    // Update basic fields
    Object.assign(profile, updateData);
    
    await this.profilesRepository.save(profile);
    return this.getProfile(userId);
  }

  async updateSparkProfile(userId: string, updateData: SparkProfileUpdate): Promise<any> {
    const profile = await this.getProfile(userId);
    
    if (profile.tier !== TierType.SPARK) {
      throw new BadRequestException('This feature is only available for Spark tier users');
    }

    // In a real implementation, this would update the spark_profiles table
    // For now, we'll return a mock response
    return {
      success: true,
      profile: {
        ...profile,
        sparkData: updateData,
      },
    };
  }

  async updateConnectProfile(userId: string, updateData: ConnectProfileUpdate): Promise<any> {
    const profile = await this.getProfile(userId);
    
    if (profile.tier !== TierType.CONNECT) {
      throw new BadRequestException('This feature is only available for Connect tier users');
    }

    // In a real implementation, this would update the connect_profiles table
    return {
      success: true,
      profile: {
        ...profile,
        connectData: updateData,
      },
    };
  }

  async updateForeverProfile(userId: string, updateData: ForeverProfileUpdate): Promise<any> {
    const profile = await this.getProfile(userId);
    
    if (profile.tier !== TierType.FOREVER) {
      throw new BadRequestException('This feature is only available for Forever tier users');
    }

    // In a real implementation, this would update the forever_profiles table
    return {
      success: true,
      profile: {
        ...profile,
        foreverData: updateData,
      },
    };
  }

  async uploadMedia(userId: string, mediaData: any): Promise<any> {
    const profile = await this.getProfile(userId);
    
    // Implementation would:
    // 1. Upload media to S3
    // 2. Create media record in database
    // 3. Update profile media array
    // 4. Handle tier-specific media requirements
    
    return {
      success: true,
      mediaId: 'media-uuid',
      url: 'https://s3.amazonaws.com/bucket/media-uuid.jpg',
    };
  }

  async deleteMedia(userId: string, mediaId: string): Promise<any> {
    // Implementation would:
    // 1. Verify media belongs to user
    // 2. Delete from S3
    // 3. Remove from database
    
    return {
      success: true,
      message: 'Media deleted successfully',
    };
  }

  async getProfilesByTier(tier: TierType, limit: number = 10): Promise<Profile[]> {
    return this.profilesRepository.find({
      where: { tier },
      take: limit,
      relations: ['user'],
    });
  }
}