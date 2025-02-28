import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'CreateCouponBookRequest' })
export class CreateCouponBookRequestDto {
  @ApiProperty({
    description: 'The name of the coupon book',
    example: 'Holiday Specials'
  })
  name: string;

  @ApiProperty({
    description: 'Optional description for the coupon book',
    example: 'Coupons available during the holiday season',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Flag indicating if multiple redemptions are allowed',
    example: false,
    default: false,
  })
  allowMultipleRedemptions?: boolean;

  @ApiProperty({
    description: 'Maximum number of redemptions per user',
    example: 5,
    required: false,
    default: 1
  })
  maxRedemptions: number;

  @ApiProperty({
    description: 'Maximum number of coupon codes allowed per user',
    example: 5,
    required: false,
  })
  maxCodesPerUser?: number;
}
