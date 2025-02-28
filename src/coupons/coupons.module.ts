import { Module } from '@nestjs/common';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponBook } from '../entities/coupons/coupon-book.entity'
import { Coupon } from '../entities/coupons/coupon.entity'
import { User } from 'src/entities/common/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon, CouponBook, User])],
  controllers: [CouponsController],
  providers: [CouponsService]
})
export class CouponsModule {}
