import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1740587995514 implements MigrationInterface {
    name = 'InitialMigration1740587995514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."coupon_status_enum" AS ENUM('available', 'assigned', 'locked', 'redeemed')`);
        await queryRunner.query(`CREATE TABLE "coupon" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "status" "public"."coupon_status_enum" NOT NULL DEFAULT 'available', "userId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "couponBookId" uuid, CONSTRAINT "UQ_62d3c5b0ce63a82c48e86d904bc" UNIQUE ("code"), CONSTRAINT "PK_fcbe9d72b60eed35f46dc35a682" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coupon_book" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "allowMultipleRedemptions" boolean NOT NULL DEFAULT false, "maxCodesPerUser" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1fdae23ec2302f87380d6b76127" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "coupon" ADD CONSTRAINT "FK_de85d4117defee7c826ff3dbea4" FOREIGN KEY ("couponBookId") REFERENCES "coupon_book"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coupon" DROP CONSTRAINT "FK_de85d4117defee7c826ff3dbea4"`);
        await queryRunner.query(`DROP TABLE "coupon_book"`);
        await queryRunner.query(`DROP TABLE "coupon"`);
        await queryRunner.query(`DROP TYPE "public"."coupon_status_enum"`);
    }

}
