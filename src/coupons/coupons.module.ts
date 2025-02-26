import { Module } from '@nestjs/common';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponBook } from '../entities/coupons/coupon-book.entity'
import { Coupon } from '../entities/coupons/coupon.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Coupon, CouponBook])],
  controllers: [CouponsController],
  providers: [CouponsService]
})
export class CouponsModule {}
