import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedMaxRedemptionsPerBook1740784392123 implements MigrationInterface {
    name = 'AddedMaxRedemptionsPerBook1740784392123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coupon_book" ADD "maxRedemptions" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coupon_book" DROP COLUMN "maxRedemptions"`);
    }

}
