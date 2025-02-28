import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAdded1740758115241 implements MigrationInterface {
    name = 'UserAdded1740758115241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "coupon" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "coupon" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "coupon" ADD CONSTRAINT "FK_03de14bf5e5b4410fced2ca9935" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coupon" DROP CONSTRAINT "FK_03de14bf5e5b4410fced2ca9935"`);
        await queryRunner.query(`ALTER TABLE "coupon" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "coupon" ADD "userId" character varying`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
