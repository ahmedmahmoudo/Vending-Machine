import { Request, Response } from "express";
import UserEntity from "../entities/user";
import UserService from "../services/user";
import * as bcrypt from "bcrypt";
import UserErrorsEnum from "../enums/errors";

export default class AuthController {
  constructor(private userService: UserService) {
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  async login(req: Request, res: Response): Promise<void> {
    const dto = req.body;
    try {
      const userResponse = await this.userService.login(dto);
      res.json(userResponse);
    } catch (e: any) {
      if (
        e.message === UserErrorsEnum.USER_NOT_FOUND ||
        e.message === UserErrorsEnum.WRONG_USERNAME_PASSWORD
      ) {
        res.status(404).send({
          message: "Username or password are incorrect",
        });
      }
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    const dto = req.body;
    if (dto.role === "admin") {
      res.status(401).send({
        errors: {
          role: "Incorrect value, must be `seller` or `buyer`",
        },
      });
      return;
    }
    try {
      const user = await this.userService.createUser(dto);
      const loginResponse = await this.userService.login({
        username: dto.username,
        password: dto.password,
      });
      res.json(loginResponse);
    } catch (e: any) {
      if (e.message === UserErrorsEnum.USER_EXISTS) {
        res
          .status(400)
          .json({ message: "User with the same username already exists" });
      } else {
        console.log(e);
        res.status(500).send();
      }
    }
  }
}
