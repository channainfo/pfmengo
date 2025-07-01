import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1703759999998 implements MigrationInterface {
  name = "InitialSchema1703759999998";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create tier enum type
    await queryRunner.query(
      `CREATE TYPE "tier_type_enum" AS ENUM('spark', 'connect', 'forever')`,
    );

    // Create users table
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "phone" character varying,
                "password" character varying NOT NULL,
                "tier" "tier_type_enum" NOT NULL,
                "tierSwitchedAt" TIMESTAMP,
                "status" character varying NOT NULL DEFAULT 'active',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_user_email" UNIQUE ("email"),
                CONSTRAINT "UQ_user_phone" UNIQUE ("phone"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

    // Create profiles table
    await queryRunner.query(`
            CREATE TABLE "profiles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "tier" "tier_type_enum" NOT NULL,
                "firstName" character varying NOT NULL,
                "lastName" character varying,
                "birthDate" date NOT NULL,
                "gender" character varying,
                "location" geography(Point,4326),
                "city" character varying,
                "country" character varying,
                "bio" text,
                "age" integer,
                "interests" text,
                "photos" text,
                "sparkProfile" jsonb,
                "connectProfile" jsonb,
                "foreverProfile" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_profiles" PRIMARY KEY ("id"),
                CONSTRAINT "FK_profiles_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);

    // Enable PostGIS extension for geography support
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "postgis"`);

    // Enable uuid extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "profiles"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "tier_type_enum"`);
  }
}
