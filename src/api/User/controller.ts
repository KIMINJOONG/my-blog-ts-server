import { Request, Response, NextFunction } from "express";
import User from "../../models/User";
import { responseMessage } from "../../responsesMessage";
import { createJWT } from "../../utils/jwt";
import { savePassword, comparePassword } from "../../utils/password";

export default {
    index: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> => {
        try {
            const users: User[] = await User.find({});
            return res.json(
                responseMessage({ success: true, message: "" }, users)
            );
        } catch (error) {
            return next(error);
        }
    },
    create: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> => {
        try {
            const savedPassword = await savePassword(req.body.password);
            req.body.password = savedPassword;
            const user = await User.create(req.body);
            return res.json(
                responseMessage({ success: true, message: "" }, user)
            );
        } catch (error) {
            return next(error);
        }
    },
    detail: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> => {
        const { id } = req.params;
        try {
            const user = await User.findOne({ _id: id });
            if (!user) {
                const error = {
                    status: -1,
                    data: null,
                    message: ""
                };
                error.status = 404;
                error.message = "존재하지 않는 유저입니다.";
                return next(error);
            }
            return res.json(
                responseMessage({ success: true, message: "" }, user)
            );
        } catch (error) {
            error.status = 404;
            return next(error);
        }
    },
    update: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> => {
        const { id } = req.params;
        const { name } = req.body;
        try {
            const user = await User.findOneAndUpdate(
                { _id: id },
                { name },
                { new: true }
            );
            if (!user) {
                const error = {
                    status: -1,
                    data: null,
                    message: ""
                };
                error.status = 404;
                error.message = "존재하지 않는 유저입니다.";
                return next(error);
            }
            return res.json(
                responseMessage({ success: true, message: "" }, user)
            );
        } catch (error) {
            error.status = 404;
            return next(error);
        }
    },
    destroy: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> => {
        const { id } = req.params;
        try {
            await User.deleteOne({ _id: id });
            return res.json(responseMessage({ success: true, message: "" }));
        } catch (error) {
            error.status = 404;
            return next(error);
        }
    },
    login: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> => {
        const {
            body: { email, password }
        } = req;
        try {
            const user: User | null = await User.findOne({ email });
            if (!user) {
                const error = {
                    status: -1,
                    data: null,
                    message: ""
                };
                error.status = 404;
                error.message = "존재하지 않는 유저입니다.";
                return next(error);
            }

            const isLoggedIn = await comparePassword(password, user.password);
            if (isLoggedIn === false) {
                const error = {
                    status: -1,
                    data: null,
                    message: ""
                };
                error.status = 404;
                error.message = "패스워드가 일치하지 않습니다.";
                return next(error);
            }
            const token = createJWT(user.id);
            return res.json(
                responseMessage({ success: true, message: "" }, token)
            );
        } catch (error) {
            next(error);
        }
    },
    me: (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        return res.json(responseMessage({ success: true, message: "" }, user));
    }
};
