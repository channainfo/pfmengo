import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLocationFields1703759999999 implements MigrationInterface {
  name = "UpdateLocationFields1703759999999";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the geography column and add latitude/longitude
    await queryRunner.query(
      `ALTER TABLE "profiles" DROP COLUMN IF EXISTS "location"`,
    );
    await queryRunner.query(`
            ALTER TABLE "profiles" 
            ADD COLUMN "latitude" DECIMAL(10,7),
            ADD COLUMN "longitude" DECIMAL(10,7)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove latitude/longitude and restore geography column
    await queryRunner.query(`
            ALTER TABLE "profiles" 
            DROP COLUMN IF EXISTS "latitude",
            DROP COLUMN IF EXISTS "longitude"
        `);
    await queryRunner.query(`
            ALTER TABLE "profiles" 
            ADD COLUMN "location" geography(Point,4326)
        `);
  }
}
