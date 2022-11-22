import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  MinLength,
} from "class-validator";
import RoleEnum from "../enums/role";

export default class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(255)
  username?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(20)
  password?: string;

  //   @Transform(() => RoleEnum)
  @IsEnum(RoleEnum)
  @IsOptional()
  role?: RoleEnum;

  @IsNumber()
  @IsOptional()
  @Max(100)
  deposit?: number;
}
