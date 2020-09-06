import { Request, Response, NextFunction } from "express";
import User from "../../config/models/User";
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
            const users: User[] = await User.findAll();
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
        const { email, name, password } = req.body;
        try {
            let error = {
                status: -1,
                data: null,
                message: "",
            };
            const user = await User.findOne({ where: { email } });
            if (user) {
                error.status = 400;
                error.message = "이미 존재하는 유저입니다.";
                return next(error);
            }
            let newUser: User = await User.create({ email, name, password });
            const hashedPassword: string | undefined = await savePassword(
                newUser.password
            );
            if (hashedPassword) {
                newUser.password = hashedPassword;
            }
            await newUser.save();

            return res
                .status(200)
                .json(responseMessage({ success: true, message: "" }, user));
        } catch (error) {
            return next(error);
        }
    },
    detail: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> => {
        const {
            params: { id },
        } = req;

        let error = {
            status: -1,
            data: null,
            message: "",
        };

        let parsedId = parseInt(id);

        if (Number.isNaN(parsedId)) {
            error.status = 400;
            error.message = "잘못된 요청입니다.";
            return next(error);
        }
        try {
            const user = await User.findOne({ where: { id: parsedId } });
            if (!user) {
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
        const {
            params: { id },
            body: { name },
        } = req;

        let error = {
            status: -1,
            data: null,
            message: "",
        };

        let parsedId = parseInt(id);

        if (Number.isNaN(parsedId)) {
            error.status = 400;
            error.message = "잘못된 요청입니다.";
            return next(error);
        }
        try {
            let user = await User.findOne({ where: { id } });
            if (!user) {
                error.status = 404;
                error.message = "존재하지 않는 유저입니다.";
                return next(error);
            }

            user = await user.update({ name }, { where: { id } });
            await user.save();

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
        const {
            params: { id },
        } = req;

        let error = {
            status: -1,
            data: null,
            message: "",
        };

        let parsedId = parseInt(id);

        if (Number.isNaN(parsedId)) {
            error.status = 400;
            error.message = "잘못된 요청입니다.";
            return next(error);
        }
        try {
            const user = await User.findOne({ where: { id: parsedId } });
            if (!user) {
                error.status = 404;
                error.message = "존재하지 않는 유저입니다.";
                return next(error);
            }
            await user.destroy();
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
            body: { email, password },
        } = req;

        let error = {
            status: -1,
            data: null,
            message: "",
        };
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                error.status = 404;
                error.message = "존재하지 않는 유저입니다.";
                return next(error);
            }

            const isLoggedIn = await comparePassword(password, user.password);

            if (isLoggedIn === false) {
                error.status = 404;
                error.message = "패스워드가 일치하지 않습니다.";
                return next(error);
            }
            const token = createJWT(user.id);
            user.token = token;
            return res.json(
                responseMessage({ success: true, message: "" }, user)
            );
        } catch (error) {
            next(error);
        }
    },
    me: (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        return res.json(responseMessage({ success: true, message: "" }, user));
    },
};
