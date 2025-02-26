import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CouponBook } from './entities/coupon-book.entity';
import { Coupon, CouponStatus } from './entities/coupon.entity';
import { CreateCouponBookDto } from './dto/create-coupon-book.dto';
import { AssignCouponDto } from './dto/assign-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(CouponBook)
    private couponBookRepository: Repository<CouponBook>,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  async createCouponBook(dto: CreateCouponBookDto): Promise<CouponBook> {
    const couponBook = this.couponBookRepository.create(dto);
    return this.couponBookRepository.save(couponBook);
  }

  async uploadCodes(couponBookId: string, codes: string[]): Promise<Coupon[]> {
    const couponBook = await this.couponBookRepository.findOne({ where: { id: couponBookId } });
    if (!couponBook) {
      throw new NotFoundException('Coupon book not found');
    }
    const coupons = codes.map(code => this.couponRepository.create({
      code,
      couponBook,
      status: CouponStatus.AVAILABLE,
    }));
    return this.couponRepository.save(coupons);
  }

  async assignRandomCoupon(dto: AssignCouponDto): Promise<Coupon> {
    const couponBook = await this.couponBookRepository.findOne({ where: { id: dto.couponBookId } });
    if (!couponBook) {
      throw new NotFoundException('Coupon book not found');
    }
    const coupon = await this.couponRepository.findOne({
      where: { couponBook, status: CouponStatus.AVAILABLE },
    });
    if (!coupon) {
      throw new NotFoundException('No available coupon');
    }
    coupon.userId = dto.userId;
    coupon.status = CouponStatus.ASSIGNED;
    return this.couponRepository.save(coupon);
  }

  async assignSpecificCoupon(code: string, dto: AssignCouponDto): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({ where: { code } });
    if (!coupon || coupon.status !== CouponStatus.AVAILABLE) {
      throw new NotFoundException('Coupon not available');
    }
    coupon.userId = dto.userId;
    coupon.status = CouponStatus.ASSIGNED;
    return this.couponRepository.save(coupon);
  }

  async lockCoupon(code: string, userId: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { code, userId, status: CouponStatus.ASSIGNED },
    });
    if (!coupon) {
      throw new NotFoundException('Coupon not found or not assigned to the user');
    }
    coupon.status = CouponStatus.LOCKED;
    return this.couponRepository.save(coupon);
  }

  async redeemCoupon(code: string, userId: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { code, userId, status: CouponStatus.LOCKED },
    });
    if (!coupon) {
      throw new NotFoundException('Coupon not locked or already redeemed');
    }
    coupon.status = CouponStatus.REDEEMED;
    return this.couponRepository.save(coupon);
  }
}
