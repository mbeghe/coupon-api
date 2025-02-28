import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { CouponStatus } from '../../entities/coupons/coupon.entity';

@ApiSchema({ name: 'AssignCouponResponse' })
export class AssignCouponResponseDto {
  @ApiProperty({ example: 'd2f7b8c4-1234-5678-9012-abcdefabcdef' })
  id: string;

  @ApiProperty({ example: 'ABC123' })
  code: string;

  @ApiProperty({ example: 'available', enum: ['available', 'assigned', 'locked', 'redeemed'] })
  status: CouponStatus;

  @ApiProperty({ example: '7b1d51b5-3a8e-42e3-94f8-cbfa78d2e1bb', nullable: true })
  user?: string | null;

  @ApiProperty({ example: '2023-05-01T00:00:00.000Z' })
  createdAt: Date;
}
