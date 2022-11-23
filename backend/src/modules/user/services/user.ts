import CreateUserDto from "../dtos/create-user";
import { Repository } from "typeorm";
import UserEntity from "../entities/user";
import UserErrorsEnum from "../enums/errors";
import UpdateUserDto from "../dtos/update-user";
import * as bcrypt from "bcrypt";
import LoginDto from "../dtos/login";
import UserResponseInterface from "../responses/user";
import jwt from "jsonwebtoken";
import ConfigUtil from "../../../utils/config.util";

export default class UserService {
  constructor(private userRepository: Repository<UserEntity>) {}

  public async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const { username, password } = dto;
    const existingUser = await this.userRepository.findOneBy({
      username,
    });
    if (existingUser) {
      throw new Error(UserErrorsEnum.USER_EXISTS);
    }
    const encryptedPw = await bcrypt.hash(password, 10);
    const user = await this.userRepository.save({
      ...dto,
      password: encryptedPw,
    });
    return user;
  }

  public async getUser(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      id,
    });
    if (!user) {
      throw new Error(UserErrorsEnum.USER_NOT_FOUND);
    }
    return user;
  }

  public async getUserByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      username,
    });
    if (!user) {
      throw new Error(UserErrorsEnum.USER_NOT_FOUND);
    }
    return user;
  }

  public async login(dto: LoginDto): Promise<UserResponseInterface> {
    const { username, password } = dto;
    const user = await this.getUserByUsername(username);
    const authenticated = await bcrypt.compare(password, user.password);
    if (authenticated) {
      const { password, ...rest } = user;
      const token = jwt.sign(
        rest,
        ConfigUtil.getConfig("tokenSecret") as string,
        {
          expiresIn: "1d",
        }
      );
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        deposit: user.deposit,
        accessToken: token,
      };
    }
    throw new Error(UserErrorsEnum.WRONG_USERNAME_PASSWORD);
  }

  public async updateUser(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    const { username } = dto;
    const user = await this.getUser(id);
    if (username && username !== user.username) {
      const existingUser = await this.getUserByUsername(username);
      if (existingUser) {
        throw new Error(UserErrorsEnum.USER_EXISTS);
      }
    }
    const updatedResult = await this.userRepository.update(id, {
      ...user,
      ...dto,
    });
    if (updatedResult.affected && updatedResult.affected > 0) {
      return {
        ...user,
        ...dto,
      };
    }
    throw new Error(UserErrorsEnum.UPDATE_WENT_WRONG);
  }

  public async updateUserWithRole(
    id: number,
    dto: UpdateUserDto
  ): Promise<UserEntity> {
    const user = await this.getUser(id);
    const updatedResult = await this.userRepository.update(id, {
      ...user,
      ...dto,
    });
    if (updatedResult.affected && updatedResult.affected > 0) {
      return {
        ...user,
        ...dto,
      };
    }
    throw new Error(UserErrorsEnum.UPDATE_WENT_WRONG);
  }

  public async deleteUser(id: number): Promise<void> {
    const user = await this.getUser(id);
    await this.userRepository.delete(user);
  }

  public async updateUserDeposit(id: number, deposit: number): Promise<number> {
    const user = await this.getUser(id);
    const updatedAmount = user.deposit + deposit;
    await this.updateUser(id, {
      deposit: updatedAmount,
    });
    return updatedAmount;
  }

  public async resetUserDeposit(id: number): Promise<void> {
    await this.getUser(id);
    await this.updateUser(id, {
      deposit: 0,
    });
  }
}
