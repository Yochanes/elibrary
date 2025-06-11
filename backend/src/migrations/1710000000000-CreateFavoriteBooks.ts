import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFavoriteBooks1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "favorite_book" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "userId" integer,
        "bookId" integer,
        CONSTRAINT "FK_favorite_book_user" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_favorite_book_book" FOREIGN KEY ("bookId") REFERENCES "book" ("id") ON DELETE CASCADE
      )
    `);

    // Создаем уникальный индекс для предотвращения дублирования избранных книг
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_favorite_book_user_book" ON "favorite_book" ("userId", "bookId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_favorite_book_user_book"`);
    await queryRunner.query(`DROP TABLE "favorite_book"`);
  }
} 