import { Request, Response, NextFunction } from "express";
import User from "../../models/User";
import { responseMessage } from "../../responsesMessage";

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
    }
};
