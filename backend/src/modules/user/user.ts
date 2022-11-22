import { Repository } from "typeorm";
import UserController from "./controllers/user";
import UserEntity from "./entities/user";
import UserService from "./services/user";
import express, { Router } from "express";
import { validateRequest } from "../../middlewares/validator";
import CreateUserDto from "./dtos/create-user";
import UpdateUserDto from "./dtos/update-user";
import DepositCoinDto from "./dtos/deposit-coin";
import LoginDto from "./dtos/login";
import AuthController from "./controllers/auth";
import { JwtAuthMiddleware, RoleMiddleware } from "../../middlewares/auth";
export default class UserModule {
  private userController: UserController;
  private userService: UserService;
  private authController: AuthController;
  private router: Router = express.Router();

  constructor(userRepository: Repository<UserEntity>) {
    this.userService = new UserService(userRepository);
    this.userController = new UserController(this.userService);
    this.authController = new AuthController(this.userService);
  }

  public getRouter(): Router {
    this.router.post(
      "/createUser",
      [
        JwtAuthMiddleware,
        RoleMiddleware("admin"),
        validateRequest(CreateUserDto),
      ],
      this.userController.createUser
    );
    this.router.get(
      "/user/:id",
      [JwtAuthMiddleware],
      this.userController.getUser
    );
    this.router.patch(
      "/user/:id/update",
      [JwtAuthMiddleware, validateRequest(UpdateUserDto)],
      this.userController.updateUser
    );
    this.router.delete(
      "/user/:id/delete",
      [JwtAuthMiddleware, RoleMiddleware("admin")],
      this.userController.deleteUser
    );
    this.router.post(
      "/deposit",
      [
        JwtAuthMiddleware,
        RoleMiddleware("buyer"),
        validateRequest(DepositCoinDto),
      ],
      this.userController.depositUserCoin
    );

    this.router.post(
      "/reset",
      [JwtAuthMiddleware, RoleMiddleware("buyer")],
      this.userController.resetUserCoins
    );

    this.router.post(
      "/login",
      validateRequest(LoginDto),
      this.authController.login
    );
    this.router.post(
      "/user",
      validateRequest(CreateUserDto),
      this.authController.register
    );

    return this.router;
  }

  public getUserService(): UserService {
    return this.userService;
  }
}
