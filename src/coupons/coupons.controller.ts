import { Controller, Post, Body, Param } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponBookDto } from './dto/create-coupon-book.dto';
import { AssignCouponDto } from './dto/assign-coupon.dto';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  createCouponBook(@Body() createCouponBookDto: CreateCouponBookDto) {
    return this.couponsService.createCouponBook(createCouponBookDto);
  }

  @Post('codes')
  uploadCodes(@Body() body: { couponBookId: string; codes: string[] }) {
    return this.couponsService.uploadCodes(body.couponBookId, body.codes);
  }

  @Post('assign')
  assignRandomCoupon(@Body() assignCouponDto: AssignCouponDto) {
    return this.couponsService.assignRandomCoupon(assignCouponDto);
  }

  @Post('assign/:code')
  assignSpecificCoupon(
    @Param('code') code: string,
    @Body() assignCouponDto: AssignCouponDto,
  ) {
    return this.couponsService.assignSpecificCoupon(code, assignCouponDto);
  }

  @Post('lock/:code')
  lockCoupon(@Param('code') code: string, @Body() body: { userId: string }) {
    return this.couponsService.lockCoupon(code, body.userId);
  }

  @Post('redeem/:code')
  redeemCoupon(@Param('code') code: string, @Body() body: { userId: string }) {
    return this.couponsService.redeemCoupon(code, body.userId);
  }
}
