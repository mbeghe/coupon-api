export class CreateCouponBookDto {
    readonly name: string;
    readonly description?: string;
    readonly allowMultipleRedemptions?: boolean;
    readonly maxCodesPerUser?: number;
}
