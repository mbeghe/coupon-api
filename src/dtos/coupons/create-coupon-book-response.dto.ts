import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'CreateCouponBookResponse' })
export class CreateCouponBookResponseDto {
  @ApiProperty({ example: 'f2c7a5f4-dfa7-48c7-8a0f-123456789abc' })
  id: string;

  @ApiProperty({ example: 'Holiday Specials' })
  name: string;

  @ApiProperty({ example: 'Coupons available during holiday season', required: false })
  description?: string;

  @ApiProperty({ example: false })
  allowMultipleRedemptions: boolean;

  @ApiProperty({ example: 1, required: false })
  maxCodesPerUser?: number;

  @ApiProperty({ example: '2023-05-01T00:00:00.000Z' })
  createdAt: Date;
}
