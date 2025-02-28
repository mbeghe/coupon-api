import { Controller, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponBookRequestDto } from '../dtos/coupons/create-coupon-book-request.dto';
import { AssignCouponRequestDto } from '../dtos/coupons/assign-coupon-request.dto';
import { CreateCouponBookResponseDto } from '../dtos/coupons/create-coupon-book-response.dto';
import { AssignCouponResponseDto } from '../dtos/coupons/assign-coupon-response.dto';

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new coupon book' })
  @ApiResponse({
    status: 201,
    description: 'Coupon book created',
    type: CreateCouponBookResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  createCouponBook(@Body() createCouponBookDto: CreateCouponBookRequestDto) {
    return this.couponsService.createCouponBook(createCouponBookDto);
  }

  @Post('codes')
  @ApiOperation({ summary: 'Upload a code list to an existing coupon book' })
  @ApiResponse({
    status: 201,
    description: 'Codes uploaded',
    type: [AssignCouponResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Coupon book not found' })
  uploadCodes(@Body() body: { couponBookId: string; codes: string[] }) {
    return this.couponsService.uploadCodes(body.couponBookId, body.codes);
  }

  @Post('assign')
  @ApiOperation({ summary: 'Assign a new random coupon code to a user' })
  @ApiResponse({
    status: 200,
    description: 'Coupon assigned',
    type: AssignCouponResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Coupon book or coupon not found' })
  assignRandomCoupon(@Body() request: AssignCouponRequestDto) {
    return this.couponsService.assignRandomCoupon(request);
  }

  @Post('assign/:code')
  @ApiOperation({ summary: 'Assign a given coupon code to a user' })
  @ApiParam({ name: 'code', description: 'Coupon code to assign', example: 'ABC123' })
  @ApiResponse({
    status: 200,
    description: 'Coupon assigned',
    type: AssignCouponResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Coupon not available' })
  assignSpecificCoupon(
    @Param('code') code: string,
    @Body() request: AssignCouponRequestDto,
  ) {
    return this.couponsService.assignSpecificCoupon(code, request);
  }

  @Post('lock/:code')
  @ApiOperation({ summary: 'Lock a coupon for redemption' })
  @ApiParam({ name: 'code', description: 'Coupon code to lock', example: 'ABC123' })
  @ApiResponse({
    status: 200,
    description: 'Coupon locked',
    type: AssignCouponResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Coupon not found or not assigned to the user' })
  lockCoupon(@Param('code') code: string, @Body() request: AssignCouponRequestDto) {
    return this.couponsService.lockCoupon(code, request.userId, request.couponBookId);
  }

  @Post('redeem/:code')
  @ApiOperation({ summary: 'Redeem a coupon' })
  @ApiParam({ name: 'code', description: 'Coupon code to redeem', example: 'ABC123' })
  @ApiResponse({
    status: 200,
    description: 'Coupon redeemed',
    type: AssignCouponResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Coupon not locked or already redeemed' })
  redeemCoupon(@Param('code') code: string, @Body() request: AssignCouponRequestDto) {
    return this.couponsService.redeemCoupon(code, request.userId, request.couponBookId);
  }
}
