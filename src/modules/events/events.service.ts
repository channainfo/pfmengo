import { Injectable } from "@nestjs/common";
import { TierType } from "../../types/tier.enum";

interface CreateEventDto {
  title: string;
  description: string;
  eventType: string;
  location: { lat: number; lng: number };
  venueName?: string;
  startsAt: Date;
  endsAt?: Date;
  maxAttendees?: number;
}

@Injectable()
export class EventsService {
  async createEvent(userId: string, eventData: CreateEventDto) {
    // Only Spark tier users can create events
    // Implementation would:
    // 1. Validate user tier
    // 2. Create event in database
    // 3. Send notifications to nearby users

    return {
      id: "event-uuid",
      ...eventData,
      createdBy: userId,
      currentAttendees: 0,
      status: "upcoming",
    };
  }

  async getEventsForUser(userId: string, tier: TierType) {
    if (tier !== TierType.SPARK) {
      return []; // Events only available for Spark tier
    }

    // Implementation would:
    // 1. Get user location
    // 2. Find events within radius
    // 3. Filter by user preferences
    // 4. Sort by proximity and time

    return [
      {
        id: "1",
        title: "Wine & Paint Night",
        description: "Creative evening with fellow singles",
        eventType: "social",
        venueName: "Art Studio Downtown",
        startsAt: new Date(),
        currentAttendees: 12,
        maxAttendees: 20,
        distance: "0.8 miles",
      },
      {
        id: "2",
        title: "Speed Dating - Young Professionals",
        description: "3-minute rounds, ages 25-35",
        eventType: "dating",
        venueName: "Rooftop Lounge",
        startsAt: new Date(),
        currentAttendees: 8,
        maxAttendees: 16,
        distance: "1.2 miles",
      },
    ];
  }

  async joinEvent(userId: string, eventId: string) {
    // Implementation would:
    // 1. Check if event exists and has space
    // 2. Check if user already joined
    // 3. Add user to attendees
    // 4. Send confirmation notification

    return {
      success: true,
      message: "Successfully joined event",
    };
  }

  async leaveEvent(userId: string, eventId: string) {
    // Implementation would:
    // 1. Remove user from attendees
    // 2. Update attendee count
    // 3. Send notification

    return {
      success: true,
      message: "Successfully left event",
    };
  }

  async getTonightEvents(userId: string) {
    // Get events happening tonight for "Tonight Mode"
    const today = new Date();
    const tonight = new Date(today.setHours(18, 0, 0, 0)); // 6 PM
    const endOfNight = new Date(today.setHours(23, 59, 59, 999)); // 11:59 PM

    // Implementation would filter events between tonight and end of night
    return this.getEventsForUser(userId, TierType.SPARK);
  }
}
