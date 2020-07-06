import { Request, Response, NextFunction } from "express";
import { responseMessage } from "../../responsesMessage";
import Board from "../../config/models/Board";
import Hashtag from "../../config/models/Hashtag";
import { Op } from "sequelize";
export default {
  index: async (req: Request, res: Response, next: NextFunction) => {
    const {
      params: { id },
    } = req;
    try {
      let boards: Board[];
      let totalCount: number;
      let limit = 10;
      const title: string = req.query.title;
      const queryLimit: string = req.query.limit;
      const pageNumber: number = req.query.page
        ? parseInt(req.query.page, 10)
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
              category: id,
            },
            limit,
            offset,
          });
          totalCount = count;
          boards = rows;
        } else {
          const { count, rows } = await Board.findAndCountAll(
            { where: { category: id }, limit, offset },
          );
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
          });
          totalCount = count;
          boards = rows;
        } else {
          const { count, rows } = await Board.findAndCountAll(
            { limit, offset },
          );
          totalCount = count;
          boards = rows;
        }
      }

      return res.json(
        responseMessage({ success: true, message: "" }, boards, totalCount),
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
      const hashtags = req.body.content.match(/#[^\s]+/g);
      const board: Board = await Board.create({
        title: req.body.title,
        content: req.body.content,
        role: 1,
        category: req.body.category,
      });

      if (hashtags) {
        await Promise.all(
          hashtags.map(async (tag: string) => {
            tag = tag.replace(/<(.|\n)*?>/g, "");
            tag = tag.trim();
            const newHashtags: Hashtag = await Hashtag.create({
              name: tag.slice(1).toLowerCase(),
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
      const board = await Board.findOne({ where: { id: parsedInt } });
      if (!board) {
        error.status = 400;
        error.message = "존재하지 않는 게시글입니다.";
        return next(error);
      }
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
    const { title, content, category } = req.body;
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
      });
      if (!board) {
        error.status = 400;
        error.message = "존재하지않는 게시글입니다.";
        return next(error);
      }

      const replaceContent = content.replace(/(<([^>]+)>)/gi, "");
      const hashtags = replaceContent.match(/#[^\s]+/g);
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
              });
              board.$add("boardHashtag", newHashtags);
            }
            return;
          }),
        );
      }

      await board.update({ title, content, category });
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
};
