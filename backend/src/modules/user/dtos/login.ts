import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export default class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(255)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
