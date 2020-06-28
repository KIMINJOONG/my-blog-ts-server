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
            const categories = await Category.findAll();
            res.json(
                responseMessage({ success: true, message: "" }, categories)
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
                    responseMessage({ success: true, message: "" }, category)
                );
            }
        } catch (e) {
            console.error(e);
            next(e);
        }
    },
};
