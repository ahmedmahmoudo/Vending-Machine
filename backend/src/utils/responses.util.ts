import { Response } from "express";

interface ResponseBody {
  message?: string;
}

export default class ResponsesUtil {
  public static noAccess(res: Response, message?: ResponseBody): void {
    res.status(401).json(message);
  }

  public static serverError(res: Response, message?: ResponseBody): void {
    res.status(500).json(message);
  }

  public static notFound(res: Response, message?: ResponseBody): void {
    res.status(404).json(message);
  }

  public static unauthorized(res: Response, message?: ResponseBody): void {
    res.status(401).json(message);
  }

  public static badInput(res: Response, message?: ResponseBody): void {
    res.status(400).json(message);
  }
}
