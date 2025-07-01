import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWizardStepSimple1751208331212 implements MigrationInterface {
  name = "AddWizardStepSimple1751208331212";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if wizardStep column already exists
    const result = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='profiles' AND column_name='wizardStep'
        `);

    if (result.length === 0) {
      // Add wizardStep column with default value of 0
      await queryRunner.query(
        `ALTER TABLE "profiles" ADD "wizardStep" integer NOT NULL DEFAULT '0'`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove wizardStep column
    await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "wizardStep"`);
  }
}
