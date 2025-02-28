import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedCouponRedemptionCount1740777914989 implements MigrationInterface {
    name = 'UpdatedCouponRedemptionCount1740777914989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coupon" ADD "redemptionCount" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "coupon" DROP CONSTRAINT "UQ_62d3c5b0ce63a82c48e86d904bc"`);
        await queryRunner.query(`ALTER TABLE "coupon" ADD CONSTRAINT "UQ_c17727ba869aecda716165fe08b" UNIQUE ("couponBookId", "code")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coupon" DROP CONSTRAINT "UQ_c17727ba869aecda716165fe08b"`);
        await queryRunner.query(`ALTER TABLE "coupon" ADD CONSTRAINT "UQ_62d3c5b0ce63a82c48e86d904bc" UNIQUE ("code")`);
        await queryRunner.query(`ALTER TABLE "coupon" DROP COLUMN "redemptionCount"`);
    }

}
