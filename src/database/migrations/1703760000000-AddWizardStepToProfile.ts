import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWizardStepToProfile1703760000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "profiles" 
            ADD COLUMN "wizardStep" integer DEFAULT 0
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "profiles" 
            DROP COLUMN "wizardStep"
        `);
  }
}
