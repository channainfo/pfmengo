import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: "postgres",
  host: configService.get<string>("DB_HOST", "localhost"),
  port: configService.get<number>("DB_PORT", 5432),
  username: configService.get<string>("DB_USERNAME", "postgres"),
  password: configService.get<string>("DB_PASSWORD", "password"),
  database: configService.get<string>("DB_NAME", "dating_app"),
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: false, // Explicitly disable synchronization
  logging: configService.get<boolean>("DB_LOGGING", false),
  migrations: [__dirname + "/../database/migrations/*{.ts,.js}"],
  migrationsRun: false, // Don't run migrations automatically
});
