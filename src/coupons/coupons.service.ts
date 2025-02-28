import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CouponBook } from '../entities/coupons/coupon-book.entity';
import { Coupon, CouponStatus } from '../entities/coupons/coupon.entity';
import { User } from '../entities/common/user.entity';
import { CreateCouponBookRequestDto } from '../dtos/coupons/create-coupon-book-request.dto';
import { AssignCouponRequestDto } from '../dtos/coupons/assign-coupon-request.dto';
import { AssignCouponResponseDto } from '../dtos/coupons/assign-coupon-response.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(CouponBook)
    private couponBookRepository: Repository<CouponBook>,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Helper method to map a Coupon entity to the response DTO
  private mapCouponToDto(coupon: Coupon): AssignCouponResponseDto {
    return {
      id: coupon.id,
      code: coupon.code,
      status: coupon.status,
      user: coupon.user ? coupon.user.id : null,
      createdAt: coupon.createdAt,
    };
  }

  async createCouponBook(dto: CreateCouponBookRequestDto): Promise<CouponBook> {
    const couponBook = this.couponBookRepository.create(dto);
    return this.couponBookRepository.save(couponBook);
  }

  async uploadCodes(couponBookId: string, codes: string[]): Promise<AssignCouponResponseDto[]> {
    // Check for duplicates in the provided codes array
    const uniqueCodes = Array.from(new Set(codes));
    if (uniqueCodes.length !== codes.length) {
      throw new BadRequestException('Duplicate coupon codes found in request.');
    }

    const couponBook = await this.couponBookRepository.findOne({ where: { id: couponBookId } });
    if (!couponBook) {
      throw new NotFoundException('Coupon book not found');
    }

    // Check for duplicate codes already in the coupon book
    const existingCoupons = await this.couponRepository.find({
      where: {
        couponBook: { id: couponBookId },
        code: In(uniqueCodes),
      },
    });
    if (existingCoupons.length > 0) {
      throw new BadRequestException('One or more coupon codes already exist in this coupon book.');
    }

    const coupons = uniqueCodes.map(code =>
      this.couponRepository.create({
        code,
        couponBook,
        status: CouponStatus.AVAILABLE,
      }),
    );
    const savedCoupons = await this.couponRepository.save(coupons);
    return savedCoupons.map(coupon => this.mapCouponToDto(coupon));
  }

  async assignRandomCoupon(dto: AssignCouponRequestDto): Promise<AssignCouponResponseDto> {
    const couponBook = await this.couponBookRepository.findOne({ where: { id: dto.couponBookId } });
    if (!couponBook) {
      throw new NotFoundException('Coupon book not found');
    }

    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Enforce maxCodesPerUser if specified
    if (couponBook.maxCodesPerUser) {
      const userCouponsCount = await this.couponRepository.count({
        where: { couponBook: { id: dto.couponBookId }, user: { id: dto.userId } },
      });
      if (userCouponsCount >= couponBook.maxCodesPerUser) {
        throw new BadRequestException('User has reached the maximum number of assigned coupon codes for this coupon book.');
      }
    }

    const coupon = await this.couponRepository.findOne({
      where: { couponBook: { id: couponBook.id }, status: CouponStatus.AVAILABLE },
    });
    if (!coupon) {
      throw new NotFoundException('No available coupon');
    }

    coupon.user = user;
    coupon.status = CouponStatus.ASSIGNED;
    const savedCoupon = await this.couponRepository.save(coupon);
    return this.mapCouponToDto(savedCoupon);
  }

  async assignSpecificCoupon(code: string, dto: AssignCouponRequestDto): Promise<AssignCouponResponseDto> {
    const coupon = await this.couponRepository.findOne({
      where: { 
        code,
        couponBook: { id: dto.couponBookId }
      },
      relations: ['couponBook'],
    });
    if (!coupon || coupon.status !== CouponStatus.AVAILABLE) {
      throw new NotFoundException('Coupon not available');
    }

    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Enforce maxCodesPerUser if specified
    const couponBook = coupon.couponBook;
    if (couponBook.maxCodesPerUser) {
      const userCouponsCount = await this.couponRepository.count({
        where: { couponBook: { id: couponBook.id }, user: { id: dto.userId } },
      });
      if (userCouponsCount >= couponBook.maxCodesPerUser) {
        throw new BadRequestException('User has reached the maximum number of assigned coupon codes for this coupon book.');
      }
    }

    coupon.user = user;
    coupon.status = CouponStatus.ASSIGNED;
    const savedCoupon = await this.couponRepository.save(coupon);
    return this.mapCouponToDto(savedCoupon);
  }

  async lockCoupon(code: string, userId: string, couponBookId: string): Promise<AssignCouponResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const coupon = await this.couponRepository.findOne({
      where: {
        code,
        status: CouponStatus.ASSIGNED,
        user: { id: userId },
        couponBook: { id: couponBookId },
      },
      relations: ['user', 'couponBook'],
    });
    if (!coupon) {
      throw new NotFoundException('Coupon not found, already locked or not assigned to the user');
    }

    coupon.status = CouponStatus.LOCKED;
    const updatedCoupon = await this.couponRepository.save(coupon);
    return this.mapCouponToDto(updatedCoupon);
  }

  async redeemCoupon(code: string, userId: string, couponBookId: string): Promise<AssignCouponResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const coupon = await this.couponRepository.findOne({
      where: {
        code,
        status: CouponStatus.LOCKED,
        user: { id: userId },
        couponBook: { id: couponBookId },
      },
      relations: ['user', 'couponBook'],
    });
    if (!coupon) {
      throw new NotFoundException('Coupon not locked or not found');
    }
  
    const couponBook = coupon.couponBook;
    if (couponBook.allowMultipleRedemptions) {
      if (coupon.redemptionCount + 1 >= couponBook.maxRedemptions) {
        coupon.redemptionCount++;
        coupon.status = CouponStatus.REDEEMED;
      } else {
        coupon.redemptionCount++;
      }
    } else {
      coupon.status = CouponStatus.REDEEMED;
    }
    
    const updatedCoupon = await this.couponRepository.save(coupon);
    return this.mapCouponToDto(updatedCoupon);
  }
}
