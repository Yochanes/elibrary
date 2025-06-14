import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRole1710000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Создаем enum тип для ролей
        await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum" AS ENUM ('USER', 'ADMIN')
        `);

        // Добавляем колонку role с значением по умолчанию 'USER'
        await queryRunner.query(`
            ALTER TABLE "user" 
            ADD COLUMN "role" "public"."user_role_enum" NOT NULL DEFAULT 'USER'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Удаляем колонку role
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "role"
        `);

        // Удаляем enum тип
        await queryRunner.query(`
            DROP TYPE "public"."user_role_enum"
        `);
    }
} 