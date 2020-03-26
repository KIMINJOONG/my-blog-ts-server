import { Request, Response, NextFunction } from "express";
import { responseMessage } from "../../responsesMessage";
import Board from "../../models/Board";
export default {
    index: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const boards: Board[] = await Board.find({});
            return res.json(
                responseMessage({ success: true, message: "" }, boards)
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
            const board = await Board.create(req.body);
            return res.json(
                responseMessage({ success: true, message: "" }, board)
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
        if (id) {
            try {
                const board = await Board.find({ _id: id });
                if (!board) {
                    let error = {
                        status: -1,
                        data: null,
                        message: ""
                    };
                    error.status = 404;
                    error.message = "존재하지 않는 게시글입니다.";
                    return next(error);
                }
                return res.json(
                    responseMessage({ success: true, message: "" }, board)
                );
            } catch (error) {
                next(error);
            }
        } else {
            let error = {
                status: -1,
                data: null,
                message: "잘못된 요청입니다."
            };
            next(error);
        }
    },
    update: () => {},
    destroy: () => {}
};
