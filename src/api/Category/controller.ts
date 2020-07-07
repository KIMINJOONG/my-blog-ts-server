import { Request, Response, NextFunction } from "express";
import { responseMessage } from "../../responsesMessage";
import Category from "../../config/models/Category";

interface ICategory {
  code: number;
  name: string;
}
export default {
  index: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { count, rows } = await Category.findAndCountAll();
      let categories: Category[] = rows;
      let totalCount: number = count;
      res.json(
        responseMessage({ success: true, message: "" }, categories, totalCount),
      );
    } catch (e) {
      console.error(e);
      next(e);
    }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createCategory: ICategory = req.body;
      const { code, name } = createCategory;

      const category: Category = await Category.create({
        code,
        name,
      });
      if (category) {
        res.json(
          responseMessage({ success: true, message: "" }, category),
        );
      }
    } catch (e) {
      console.error(e);
      next(e);
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
      const category: Category | null = await Category.findOne({
        where: { id: parsedId },
      });
      if (!category) {
        error.status = 400;
        error.message = "존재하지않는 게시글입니다.";
        return next(error);
      }

      await category.destroy();
      return res.json(responseMessage({ success: true, message: "" }));
    } catch (error) {
      error.status = 404;
      return next(error);
    }
  },
};
