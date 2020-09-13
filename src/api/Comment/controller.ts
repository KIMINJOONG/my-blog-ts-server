import { Request, Response, NextFunction } from "express";
import Board from "../../config/models/Board";
import Comment from "../../config/models/Comment";
import { responseMessage } from "../../responsesMessage";
import User from "../../config/models/User";
export default {
    index: async (req: Request, res: Response, next: NextFunction) => {
        const {
            params: { boardId },
        } = req;

        let parsedInt: number = parseInt(boardId);

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
            const board: Board | null = await Board.findOne({
                where: { id: boardId },
            });

            if (!board) {
                error.status = 404;
                error.message = "존재하지않는 게시글입니다.";
                return next(error);
            }

            const { count, rows } = await Comment.findAndCountAll({
                where: {
                    boardId: parsedInt,
                },
                include: [
                    {
                        model: User,
                        attributes: ["email", "name"],
                    },
                ],
            });
            let totalCount = count;
            let comments = rows;

            return res.json(
                responseMessage(
                    { success: true, message: "" },
                    comments,
                    totalCount
                )
            );
        } catch (error) {
            next(error);
        }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
        const {
            params: { boardId },
        } = req;

        let parsedInt: number = parseInt(boardId);

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
            const board: Board | null = await Board.findOne({
                where: { id: boardId },
            });

            if (!board) {
                error.status = 404;
                error.message = "존재하지않는 게시글입니다.";
                return next(error);
            }

            let comment: Comment | null = await Comment.create({
                boardId,
                content: req.body.comment,
                userId: req.user.id,
            });
            comment = await Comment.findOne({
                where: {
                    id: comment.id,
                },
                include: [
                    {
                        model: User,
                        attributes: ["email", "name"],
                    },
                ],
            });
            return res.json(
                responseMessage({ success: true, message: "" }, comment)
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
        const { boardId, commentId } = req.params;
        const { content } = req.body;
        const parsedId: number = parseInt(boardId);
        const parsedCommentId = parseInt(commentId);

        let error = {
            status: -1,
            data: null,
            message: "",
        };

        if (Number.isNaN(parsedId) || Number.isNaN(parsedCommentId)) {
            error.status = 404;
            error.message = "잘못된 요청입니다";
            return next(error);
        }

        try {
            const board = await Board.findOne({
                where: { id: parsedId },
            });
            if (!board) {
                error.status = 400;
                error.message = "존재하지않는 게시글입니다.";
                return next(error);
            }

            const comment = await Comment.findOne({
                where: { id: commentId },
            });

            if (!comment) {
                error.status = 400;
                error.message = "존재하지않는 댓글입니다.";
                return next(error);
            }

            await comment.update({ content });
            await comment.save();
            return res.json(
                responseMessage({ success: true, message: "" }, comment)
            );
        } catch (error) {
            console.error("에러 발생 :", error);
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
            params: { boardId, commentId },
        } = req;

        let error = {
            status: -1,
            data: null,
            message: "",
        };

        const parsedId: number = parseInt(boardId);
        const parsedCommentId: number = parseInt(commentId);
        if (Number.isNaN(parsedId) || Number.isNaN(parsedCommentId)) {
            error.status = 404;
            error.message = "잘못된 요청입니다.";
            return next(error);
        }
        try {
            const board = await Board.findOne({
                where: { id: parsedId },
            });
            if (!board) {
                error.status = 400;
                error.message = "존재하지않는 게시글입니다.";
                return next(error);
            }

            const comment = await Comment.findOne({
                where: { id: parsedCommentId },
            });

            if (!comment) {
                error.status = 400;
                error.message = "존재하지않는 댓글입니다.";
                return next(error);
            }

            await comment.destroy();
            return res.json(
                responseMessage({ success: true, message: "" }, comment)
            );
        } catch (error) {
            console.log("error탐 : ", error);
            error.status = 404;
            return next(error);
        }
    },
};
