import { Request, Response, NextFunction } from "express";
import { responseMessage } from "../../responsesMessage";
import Board from "../../config/models/Board";
import Hashtag from "../../config/models/Hashtag";
export default {
    index: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const boards: Board[] = await Board.findAll();
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
            const hashtags = req.body.content.match(/#[^\s]+/g);
            const board = await Board.create(req.body);
            if (hashtags) {
                await Promise.all(
                    hashtags.map(async (tag: string) => {
                        const newHashtags = await Hashtag.create({
                            tag: tag.slice(1).toLowerCase(),
                        });
                        board.hashtags.push(newHashtags);
                        return;
                    })
                );
            }
            await board.save();
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
        const {
            params: { id },
        } = req;
        let parsedInt: number = parseInt(id);

        let error = {
            status: -1,
            data: null,
            message: "",
        };

        if (Number.isNaN(parsedInt)) {
            error.status = 404;
            error.message = "잘못된 요청입니다";
            return next(error);
        }
        try {
            const board = await Board.findOne({ where: { id: parsedInt } });
            if (!board) {
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
    },
    update: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> => {
        const { id } = req.params;
        const { title } = req.body;
        const parsedId: number = parseInt(id);

        let error = {
            status: -1,
            data: null,
            message: "",
        };

        if (Number.isNaN(parsedId)) {
            error.status = 404;
            error.message = "잘못된 요청입니다";
            return next(error);
        }

        try {
            const board: Board = await Board.findOne({
                where: { id: parsedId },
            });
            if (!board) {
                error.status = 404;
                error.message = "존재하지않는 게시글입니다.";
                return next(error);
            }

            await board.update({ title });
            await board.save();
            return res.json(
                responseMessage({ success: true, message: "" }, board)
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

        const parsedId: number = parseInt(id);
        if (Number.isNaN(parsedId)) {
            error.status = 404;
            error.message = "잘못된 요청입니다.";
            return next(error);
        }
        try {
            const board: Board = await Board.findOne({
                where: { id: parsedId },
            });
            await board.destroy();
            return res.json(responseMessage({ success: true, message: "" }));
        } catch (error) {
            error.status = 404;
            return next(error);
        }
    },
};
