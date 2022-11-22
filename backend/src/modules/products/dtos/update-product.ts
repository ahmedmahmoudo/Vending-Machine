import { IsDefined, IsNumber, IsOptional, IsString } from "class-validator";

export default class UpdateProductDto {
  @IsString()
  @IsOptional()
  productName?: string;

  @IsNumber()
  @IsOptional()
  amountAvailable?: number;

  @IsNumber()
  @IsOptional()
  cost?: number;
}
