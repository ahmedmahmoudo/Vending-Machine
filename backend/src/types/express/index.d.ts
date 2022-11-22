import UserEntity from "../../modules/user/entities/user";

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: UserEntity;
    }
  }
}
