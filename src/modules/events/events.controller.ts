import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TierGuard } from '../../common/guards/tier.guard';
import { RequiredTiers } from '../../common/decorators/tier.decorator';
import { EventsService } from './events.service';
import { TierType } from '../../types/tier.enum';

@ApiTags('spark')
@Controller('events')
@UseGuards(JwtAuthGuard, TierGuard)
@RequiredTiers(TierType.SPARK)
@ApiBearerAuth()
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Get nearby events (Spark tier only)' })
  @ApiResponse({ status: 200, description: 'Events retrieved successfully' })
  async getEvents(@Request() req) {
    return this.eventsService.getEventsForUser(req.user.id, req.user.tier);
  }

  @Get('tonight')
  @ApiOperation({ summary: 'Get tonight mode events (Spark tier only)' })
  @ApiResponse({ status: 200, description: 'Tonight events retrieved successfully' })
  async getTonightEvents(@Request() req) {
    return this.eventsService.getTonightEvents(req.user.id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new event (Spark tier only)' })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  async createEvent(@Body() eventData: any, @Request() req) {
    return this.eventsService.createEvent(req.user.id, eventData);
  }

  @Post(':eventId/join')
  @ApiOperation({ summary: 'Join an event' })
  @ApiResponse({ status: 200, description: 'Successfully joined event' })
  async joinEvent(@Param('eventId') eventId: string, @Request() req) {
    return this.eventsService.joinEvent(req.user.id, eventId);
  }

  @Post(':eventId/leave')
  @ApiOperation({ summary: 'Leave an event' })
  @ApiResponse({ status: 200, description: 'Successfully left event' })
  async leaveEvent(@Param('eventId') eventId: string, @Request() req) {
    return this.eventsService.leaveEvent(req.user.id, eventId);
  }
}