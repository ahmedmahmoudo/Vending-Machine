import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ConfigUtil from "../utils/config.util";
import { plainToClass } from "class-transformer";
import UserEntity from "../modules/user/entities/user";

export const JwtAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  try {
    if (token && token.split(" ").length > 1) {
      const user = plainToClass(
        UserEntity,
        jwt.verify(
          token.split(" ")[1],
          ConfigUtil.getConfig("tokenSecret") as string
        )
      );
      if (user) {
        req.user = user;
        next();
      }
    } else {
      reject(res);
    }
  } catch (e) {
    reject(res);
  }
};

export const RoleMiddleware =
  (role: string) => (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || (user.role !== role && user.role !== "admin")) {
      reject(res);
      return;
    }
    next();
  };

const reject = (res: Response): void => {
  res.status(401).send();
};
