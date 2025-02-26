import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { CouponBook } from './coupon-book.entity';

export enum CouponStatus {
  AVAILABLE = 'available',
  ASSIGNED = 'assigned',
  LOCKED = 'locked',
  REDEEMED = 'redeemed',
}

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({
    type: 'enum',
    enum: CouponStatus,
    default: CouponStatus.AVAILABLE,
  })
  status: CouponStatus;

  @Column({ nullable: true })
  userId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => CouponBook, couponBook => couponBook.coupons, { onDelete: 'CASCADE' })
  couponBook: CouponBook;
}
