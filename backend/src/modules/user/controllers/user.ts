import { Request, Response } from "express";
import ResponsesUtil from "../../../utils/responses.util";
import UserErrorsEnum from "../enums/errors";
import UserService from "../services/user";

const allowedAmount = [5, 10, 20, 50, 100];

export default class UserController {
  constructor(private userService: UserService) {
    this.createUser = this.createUser.bind(this);
    this.getUser = this.getUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.depositUserCoin = this.depositUserCoin.bind(this);
    this.resetUserCoins = this.resetUserCoins.bind(this);
  }

  public async createUser(req: Request, res: Response): Promise<void> {
    const dto = req.body;
    try {
      const { password, ...user } = await this.userService.createUser(dto);
      res.json(user);
    } catch (e: any) {
      if (e.message === UserErrorsEnum.USER_EXISTS) {
        this.usernameExists(res);
      } else {
        console.log(e);
        ResponsesUtil.serverError(res);
      }
    }
  }

  public async getUser(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const userId = parseInt(req.params.id, 10);
    if (user && user.id !== userId && user.role !== "admin") {
      res.status(401).send();
      return;
    }
    try {
      const { password, ...user } = await this.userService.getUser(userId);
      res.json(user);
    } catch (e: any) {
      if (e.message === UserErrorsEnum.USER_NOT_FOUND) {
        this.userNotFound(res);
      } else {
        ResponsesUtil.serverError(res);
      }
    }
  }

  public async updateUser(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const userId = parseInt(req.params.id, 10);
    if (user && user.id !== userId && user.role !== "admin") {
      res.status(401).send();
      return;
    }
    const dto = req.body;
    if (user && user.role !== "admin") {
      delete dto.deposit;
      delete dto.role;
    }

    if (user && user.role === "admin" && dto.deposit) {
      if (!allowedAmount.includes(dto.deposit)) {
        this.invalidAmountToDeposit(res);
      }
    }

    try {
      const { password, ...user } = await this.userService.updateUser(
        userId,
        dto
      );
      res.json(user);
    } catch (e: any) {
      if (e.message === UserErrorsEnum.USER_NOT_FOUND) {
        this.userNotFound(res);
      } else if (e.message === UserErrorsEnum.USER_EXISTS) {
        this.usernameExists(res);
      } else {
        ResponsesUtil.serverError(res);
      }
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.id, 10);
    try {
      await this.userService.deleteUser(userId);
      res.status(200).json();
    } catch (e: any) {
      if (e.message === UserErrorsEnum.USER_NOT_FOUND) {
        this.userNotFound(res);
      } else {
        ResponsesUtil.serverError(res);
      }
    }
  }

  public async depositUserCoin(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const userId = user!.id;
    const depositAmount = req.body.amount;
    if (!allowedAmount.includes(depositAmount)) {
      this.invalidAmountToDeposit(res);
    } else {
      try {
        const amount = await this.userService.updateUserDeposit(
          userId,
          depositAmount
        );
        res.json({
          amount,
        });
      } catch (e: any) {
        if (e.message === UserErrorsEnum.USER_NOT_FOUND) {
          this.userNotFound(res);
        } else {
          ResponsesUtil.serverError(res, { message: "Error" });
        }
      }
    }
  }

  public async resetUserCoins(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const userId = user!.id;
    try {
      await this.userService.resetUserDeposit(userId);
      res.json({
        amount: 0,
      });
    } catch (e: any) {
      if (e.message === UserErrorsEnum.USER_NOT_FOUND) {
        ResponsesUtil.notFound(res, { message: "User not found" });
      } else if (e.message === UserErrorsEnum.UPDATE_WENT_WRONG) {
        this.userNotFound(res);
      } else {
        ResponsesUtil.serverError(res);
      }
    }
  }

  private userNotFound(res: Response): void {
    ResponsesUtil.badInput(res, {
      message: "Something went wrong while updating the user",
    });
  }

  private usernameExists(res: Response): void {
    ResponsesUtil.badInput(res, { message: "This username already exists" });
  }

  private invalidAmountToDeposit(res: Response): void {
    ResponsesUtil.badInput(res, {
      message: `Invalid amount to deposit, amount must be ${allowedAmount.join(
        ","
      )}`,
    });
  }
}
