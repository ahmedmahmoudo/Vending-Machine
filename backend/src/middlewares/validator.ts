import { validateOrReject } from "class-validator";
import { NextFunction, Request, Response } from "express";

export const validateRequest =
  (dtoClass: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const body = Object.assign(new dtoClass(), req.body);
    try {
      await validateOrReject(body);
      next();
    } catch (e) {
      res.status(400).send(e);
    }
  };
