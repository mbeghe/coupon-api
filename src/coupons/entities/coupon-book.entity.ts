import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Coupon } from './coupon.entity';

@Entity()
export class CouponBook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: false })
  allowMultipleRedemptions: boolean;

  @Column({ nullable: true })
  maxCodesPerUser?: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Coupon, coupon => coupon.couponBook)
  coupons: Coupon[];
}
