import { IsDefined, IsNumber, IsString } from "class-validator";

export default class CreateProductDto {
  @IsString()
  @IsDefined()
  productName: string;

  @IsNumber()
  @IsDefined()
  amountAvailable: number;

  @IsNumber()
  @IsDefined()
  cost: number;
}
