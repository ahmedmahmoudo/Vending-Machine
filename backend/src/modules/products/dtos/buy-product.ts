import { IsDefined, IsNumber } from "class-validator";

export class BuyProductDto {
  @IsNumber()
  @IsDefined()
  productId: number;

  @IsNumber()
  @IsDefined()
  amount: number;
}
