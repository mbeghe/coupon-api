import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponsModule } from './coupons/coupons.module';
import { CouponBook } from './coupons/entities/coupon-book.entity';
import { Coupon } from './coupons/entities/coupon.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'your_db_user',
      password: process.env.DB_PASSWORD || 'your_db_password',
      database: process.env.DB_NAME || 'your_db_name',
      entities: [CouponBook, Coupon],
      synchronize: true, // Turn off in production
    }),
    CouponsModule,
  ],
})
export class AppModule {}
