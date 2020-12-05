import { Request, Response, NextFunction } from "express";
import { responseMessage } from "../../responsesMessage";
import Board from "../../config/models/Board";
import Hashtag from "../../config/models/Hashtag";
import { Op } from "sequelize";
import { Sequelize } from "sequelize";
import Like from "../../config/models/Like";
import Category from "../../config/models/Category";
import { getToday } from "../../utils/date";
import Comment from "../../config/models/Comment";
import User from "../../config/models/User";
export default {
  index: async (req: Request, res: Response, next: NextFunction) => {
    const {
      params: { id },
    } = req;
    try {
      let boards: Board[];
      let totalCount: number;
      let limit = 10;
      const title: string = req.query.title as string;
      const queryLimit: string = req.query.limit as string;
      const pageNumber: number = req.query.page
        ? parseInt(req.query.page as string, 10)
        : 0;
      let offset: number = 0;

      if (queryLimit) {
        limit = parseInt(queryLimit, 10);
      }

      if (pageNumber > 1) {
        offset = limit * (pageNumber - 1);
      }

      if (id) {
        if (title) {
          const { count, rows } = await Board.findAndCountAll({
            where: {
              title: {
                [Op.like]: "%" + title + "%",
              },
              categoryId: id,
            },
            limit,
            offset,
            order: [["createdAt", "DESC"]],
          });
          totalCount = count;
          boards = rows;
        } else {
          const { count, rows } = await Board.findAndCountAll({
            where: { categoryId: id },
            include: [
              {
                model: Comment,
                attributes: ["content"],
              },
            ],
            limit,
            offset,
            order: [["createdAt", "DESC"]],
          });
          totalCount = count;
          boards = rows;
        }
      } else {
        if (title) {
          const { count, rows } = await Board.findAndCountAll({
            where: {
              title: {
                [Op.like]: "%" + title + "%",
              },
            },
            limit,
            offset,
            order: [["createdAt", "DESC"]],
          });
          totalCount = count;
          boards = rows;
        } else {
          const { count, rows } = await Board.findAndCountAll({
            include: [{ model: Category }],
            limit,
            offset,
            order: [["createdAt", "DESC"]],
          });
          totalCount = count;
          boards = rows;
        }
      }

      return res.json(
        responseMessage(
          { success: true, message: "" },
          boards,
          totalCount,
        ),
      );
    } catch (error) {
      return next(error);
    }
  },
  create: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      let hashtags = req.body.content.match(/#[^\s]+/g);
      const board: Board = await Board.create({
        title: req.body.title,
        content: req.body.content,
        role: 1,
        categoryId: req.body.categoryId,
      });

      if (hashtags) {
        await Promise.all(
          hashtags.map(async (tag: string) => {
            tag = tag.replace(/<(.|\n)*?>/g, "");
            tag = tag.trim();
            const newHashtags: Hashtag = await Hashtag.create({
              name: tag.slice(1).toLowerCase(),
              categoryId: req.body.category,
            });
            board.$add("boardHashtag", newHashtags);
            return;
          }),
        );
      }
      await board.save();
      return res.json(
        responseMessage({ success: true, message: "" }, board),
      );
    } catch (error) {
      return next(error);
    }
  },

  detail: async (
    req: Request,
    res: Response,
    next: NextFunction,
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
      const board = await Board.findOne({
        where: { id: parsedInt },
        include: [
          {
            model: Like,
          },
          {
            model: Comment,
            include: [
              {
                model: User,
                attributes: ["email", "name"],
              },
            ],
          },
        ],
      });
      if (!board) {
        error.status = 400;
        error.message = "존재하지 않는 게시글입니다.";
        return next(error);
      }
      board.update({
        view: board.view + 1,
      });
      return res.json(
        responseMessage({ success: true, message: "" }, board),
      );
    } catch (error) {
      next(error);
    }
  },
  update: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    const { id } = req.params;
    const { title, content, categoryId } = req.body;
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
      const board = await Board.findOne({
        where: { id: parsedId },
        include: [
          {
            model: Like,
          },
          {
            model: Comment,
            include: [
              {
                model: User,
                attributes: ["email", "name"],
              },
            ],
          },
        ],
      });
      if (!board) {
        error.status = 400;
        error.message = "존재하지않는 게시글입니다.";
        return next(error);
      }

      let hashtags = req.body.content.match(/#[^\s]+/g);
      if (hashtags) {
        await Promise.all(
          hashtags.map(async (tag: string) => {
            tag = tag.replace(/<(.|\n)*?>/g, "");
            tag = tag.trim();
            const hashtag: Hashtag | null = await Hashtag.findOne({
              where: { name: tag.slice(1).toLowerCase() },
            });
            if (!hashtag) {
              const newHashtags: Hashtag = await Hashtag.create({
                name: tag.slice(1).toLowerCase(),
                categoryId,
              });
              board.$add("boardHashtag", newHashtags);
            }
            return;
          }),
        );
      }


      await board.update({ title, content, categoryId });
      
      await board.save();
      return res.json(
        responseMessage({ success: true, message: "" }, board),
      );
    } catch (error) {
      error.status = 404;
      return next(error);
    }
  },
  destroy: async (
    req: Request,
    res: Response,
    next: NextFunction,
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
      const board = await Board.findOne({
        where: { id: parsedId },
      });
      if (!board) {
        error.status = 400;
        error.message = "존재하지않는 게시글입니다.";
        return next(error);
      }

      await board.destroy();
      return res.json(responseMessage({ success: true, message: "" }));
    } catch (error) {
      error.status = 404;
      return next(error);
    }
  },
  getCountByDate: async (req: Request, res: Response) => {
    const countByDate: Board[] = await Board.findAll({
      attributes: [
        [Sequelize.literal(`DATE(createdAt)`), "date"],
        [Sequelize.literal(`COUNT(*)`), "count"],
      ],
      group: ["date"],
    });

    return res.json(
      responseMessage({ success: true, message: "" }, countByDate),
    );
  },
  getCountByToday: async (req: Request, res: Response) => {
    try {
      let today = getToday();
      const { count: countByToday, rows } = await Board.findAndCountAll({
        where: Sequelize.where(
          Sequelize.fn("date", Sequelize.col("Board.createdAt")),
          "=",
          today,
        ),
        include: [{ model: Category }],
      });

      return res.json(
        responseMessage(
          { success: true, message: "" },
          rows,
          countByToday,
        ),
      );
    } catch (error) {
      console.log("error :", error);
    }
  },
};
