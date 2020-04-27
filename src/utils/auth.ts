import { Request, Response, NextFunction } from "express";
import { decodeJWT } from "./jwt";
import User from "../config/models/User";

export const isLoggedIn = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let token = req.headers["authorization"];
    token = token?.split("=")[1];

    if (!token) {
        const error = {
            status: -1,
            data: null,
            message: "",
        };
        error.status = 200;
        error.message = "토큰이 존재하지않습니다.";
        return next(error);
    }
    const user: User | undefined = await decodeJWT(token as string);
    if (!user) {
        const error = {
            status: -1,
            data: null,
            message: "",
        };
        error.status = 404;
        error.message = "잘못된 토큰입니다.";
        return next(error);
    }
    // delete user.password;
    user.password = "";
    req.user = user;
    next();
};

// export const isNotLoggedIn = (req:Request, res: Response, next: NextFunction) => {
//     if (!req.user) {
//         next();
//     } else {
//         res.status(401).send("로그인한 사용자는 접근할 수 없습니다.");
//     }
// };
