import { IsDefined, IsNumber, IsPositive } from "class-validator";

export default class DepositCoinDto {
  @IsNumber()
  @IsPositive()
  @IsDefined()
  amount: number;
}
