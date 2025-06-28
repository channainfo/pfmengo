import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { TierGuard } from "../../common/guards/tier.guard";
import { RequiredTiers } from "../../common/decorators/tier.decorator";
import { MatchingService } from "./matching.service";
import { TierType } from "../../types/tier.enum";

@ApiTags("matching")
@Controller("matching")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MatchingController {
  constructor(private matchingService: MatchingService) {}

  @Get("daily")
  @UseGuards(TierGuard)
  @RequiredTiers(TierType.CONNECT, TierType.FOREVER)
  @ApiOperation({
    summary: "Get daily curated matches (Connect & Forever only)",
  })
  @ApiResponse({
    status: 200,
    description: "Daily matches retrieved successfully",
  })
  async getDailyMatches(@Request() req) {
    return this.matchingService.getDailyMatches(req.user);
  }

  @Get("tonight")
  @UseGuards(TierGuard)
  @RequiredTiers(TierType.SPARK)
  @ApiOperation({ summary: "Get tonight mode matches (Spark only)" })
  @ApiResponse({
    status: 200,
    description: "Tonight matches retrieved successfully",
  })
  async getTonightMatches(@Request() req) {
    // Spark-specific tonight mode matching
    const criteria = {
      userId: req.user.id,
      tier: req.user.tier,
      tonightMode: true,
    };
    return this.matchingService.findMatches(criteria);
  }

  @Post("like")
  @ApiOperation({ summary: "Like a user" })
  @ApiResponse({ status: 200, description: "Like recorded successfully" })
  async likeUser(@Body() body: { targetUserId: string }, @Request() req) {
    // Implementation for liking a user
    // Check daily limits based on tier
    // Record the like
    // Check for mutual match
    return { success: true, matched: false };
  }

  @Post("pass")
  @ApiOperation({ summary: "Pass on a user" })
  @ApiResponse({ status: 200, description: "Pass recorded successfully" })
  async passUser(@Body() body: { targetUserId: string }, @Request() req) {
    // Implementation for passing on a user
    return { success: true };
  }

  @Post("super-like")
  @ApiOperation({ summary: "Super like a user (premium feature)" })
  @ApiResponse({ status: 200, description: "Super like sent successfully" })
  async superLike(@Body() body: { targetUserId: string }, @Request() req) {
    // Implementation for super like
    // Check if user has super likes available
    // Send notification to target user
    return { success: true };
  }
}
