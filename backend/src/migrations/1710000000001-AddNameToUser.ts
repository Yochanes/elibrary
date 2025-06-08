import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameToUser1710000000001 implements MigrationInterface {
    name = 'AddNameToUser1710000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    }
} 