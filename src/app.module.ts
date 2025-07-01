import { Module, Controller, Get } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThrottlerModule } from "@nestjs/throttler";

// Modules
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { MatchingModule } from "./modules/matching/matching.module";
import { ProfilesModule } from "./modules/profiles/profiles.module";
import { EventsModule } from "./modules/events/events.module";

// Config
import { getDatabaseConfig } from "./config/database.config";

@Controller()
export class AppController {
  @Get("health")
  health() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>("THROTTLE_TTL", 60),
        limit: configService.get<number>("THROTTLE_LIMIT", 10),
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    MatchingModule,
    ProfilesModule,
    EventsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
