import { Request, Response, NextFunction } from "express";
import { responseMessage } from "../../responsesMessage";
import Board from "../../models/Board";
import Hashtag from "../../models/Hashtag";
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
            const hashtags = req.body.content.match(/#[^\s]+/g);
            const board = await Board.create(req.body);
            if (hashtags) {
                await Promise.all(
                    hashtags.map(async (tag: string) => {
                        const newHashtags = await Hashtag.create({
                            tag: tag.slice(1).toLowerCase()
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
    update: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> => {
        const { id } = req.params;
        const { title } = req.body;
        try {
            const board = await Board.findOneAndUpdate(
                { _id: id },
                { title },
                { new: true }
            );
            if (!board) {
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
        const { id } = req.params;
        try {
            await Board.deleteOne({ _id: id });
            return res.json(responseMessage({ success: true, message: "" }));
        } catch (error) {
            error.status = 404;
            return next(error);
        }
    }
};
