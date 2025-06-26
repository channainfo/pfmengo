import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TierGuard } from '../../common/guards/tier.guard';
import { RequiredTiers } from '../../common/decorators/tier.decorator';
import { ProfilesService } from './profiles.service';
import { TierType } from '../../types/tier.enum';

@ApiTags('profiles')
@Controller('profiles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getMyProfile(@Request() req) {
    return this.profilesService.getProfile(req.user.id);
  }

  @Put('basic')
  @ApiOperation({ summary: 'Update basic profile information' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateBasicProfile(@Body() updateData: any, @Request() req) {
    return this.profilesService.updateBasicProfile(req.user.id, updateData);
  }

  @Put('spark')
  @UseGuards(TierGuard)
  @RequiredTiers(TierType.SPARK)
  @ApiOperation({ summary: 'Update Spark-specific profile data' })
  @ApiResponse({ status: 200, description: 'Spark profile updated successfully' })
  async updateSparkProfile(@Body() updateData: any, @Request() req) {
    return this.profilesService.updateSparkProfile(req.user.id, updateData);
  }

  @Put('connect')
  @UseGuards(TierGuard)
  @RequiredTiers(TierType.CONNECT)
  @ApiOperation({ summary: 'Update Connect-specific profile data' })
  @ApiResponse({ status: 200, description: 'Connect profile updated successfully' })
  async updateConnectProfile(@Body() updateData: any, @Request() req) {
    return this.profilesService.updateConnectProfile(req.user.id, updateData);
  }

  @Put('forever')
  @UseGuards(TierGuard)
  @RequiredTiers(TierType.FOREVER)
  @ApiOperation({ summary: 'Update Forever-specific profile data' })
  @ApiResponse({ status: 200, description: 'Forever profile updated successfully' })
  async updateForeverProfile(@Body() updateData: any, @Request() req) {
    return this.profilesService.updateForeverProfile(req.user.id, updateData);
  }

  @Post('media')
  @ApiOperation({ summary: 'Upload profile media (photos/videos)' })
  @ApiResponse({ status: 201, description: 'Media uploaded successfully' })
  async uploadMedia(@Body() mediaData: any, @Request() req) {
    return this.profilesService.uploadMedia(req.user.id, mediaData);
  }

  @Delete('media/:mediaId')
  @ApiOperation({ summary: 'Delete profile media' })
  @ApiResponse({ status: 200, description: 'Media deleted successfully' })
  async deleteMedia(@Param('mediaId') mediaId: string, @Request() req) {
    return this.profilesService.deleteMedia(req.user.id, mediaId);
  }

  @Get(':profileId')
  @ApiOperation({ summary: 'View another user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async viewProfile(@Param('profileId') profileId: string, @Request() req) {
    // Implementation would include privacy controls based on tier
    return this.profilesService.getProfile(profileId);
  }
}