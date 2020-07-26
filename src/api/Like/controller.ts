import { Request, Response, NextFunction } from "express";
import Board from "../../config/models/Board";
import Comment from "../../config/models/Comment";
import { responseMessage } from "../../responsesMessage";
import User from "../../config/models/User";
import Like from "../../config/models/Like";
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
      const board: Board | null = await Board.findOne(
        { where: { id: boardId } },
      );

      if (!board) {
        error.status = 404;
        error.message = "존재하지않는 게시글입니다.";
        return next(error);
      }

      const { count } = await Like.findAndCountAll({
        where: {
          boardId: parsedInt,
        },
        include: [{
          model: User,
          attributes: ["email", "name"],
        }],
      });
      let totalCount = count;

      return res.json(
        responseMessage(
          { success: true, message: "" },
          totalCount,
        ),
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
      const board: Board | null = await Board.findOne(
        { where: { id: boardId } },
      );

      if (!board) {
        error.status = 404;
        error.message = "존재하지않는 게시글입니다.";
        return next(error);
      }

      let like: Like | null = await Like.findOne({
        where: {
          boardId,
          userId: req.user.id,
        },
      });

      let message = "";

      if (like) {
        like.destroy();
        message = "deleted";
      } else {
        like = await Like.create({
          boardId,
          userId: req.user.id,
        });
        message = "liked";
      }

      return res.json(
        responseMessage({ success: true, message }),
      );
    } catch (error) {
      next(error);
    }
  },
};
