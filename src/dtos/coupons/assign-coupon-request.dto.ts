import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'AssignCouponRequest' })
export class AssignCouponRequestDto {
  @ApiProperty({
    description: 'The unique identifier of the coupon book',
    example: 'e9a60a72-d7d1-4b9f-a1f5-3edb5d4e3f6b',
  })
  couponBookId: string;

  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '7b1d51b5-3a8e-42e3-94f8-cbfa78d2e1bb',
  })
  userId: string;
}
