import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { CouponBook } from './coupon-book.entity';
import { User } from '../common/user.entity';

export enum CouponStatus {
  AVAILABLE = 'available',
  ASSIGNED = 'assigned',
  LOCKED = 'locked',
  REDEEMED = 'redeemed',
}

@Entity()
@Unique(['couponBook', 'code']) // Ensures the combination of couponBook and code is unique
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column({
    type: 'enum',
    enum: CouponStatus,
    default: CouponStatus.AVAILABLE,
  })
  status: CouponStatus;

  @ManyToOne(() => User, user => user.coupons, { nullable: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => CouponBook, couponBook => couponBook.coupons, { onDelete: 'CASCADE' })
  couponBook: CouponBook;

  @Column({ type: 'int', default: 0 })
  redemptionCount: number;
}
