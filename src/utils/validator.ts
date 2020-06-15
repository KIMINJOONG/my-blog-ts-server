import validator from "validator";
import { Request, Response, NextFunction } from "express";

export const joinValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const isEmail = validator.isEmail(req.body.email);
  const isPassword = validator.isEmpty(req.body.password);
  if (!isEmail) {
    next("이메일이 아닙니다.");
  }
  if (isPassword) {
    return res.status(404);
  }

  next();
};
