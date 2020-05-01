import { Request, Response, NextFunction } from "express";
import { responseMessage } from "../../responsesMessage";
import Board from "../../config/models/Board";
import Hashtag from "../../config/models/Hashtag";

export default {
    index: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const boards = await Board.findAll({
                include: [
                    {
                        model: Hashtag,
                        where: { name: decodeURIComponent(req.params.tag) },
                    },
                    // {
                    //     model: db.User,
                    //     attributes: ["id", "nickname"],
                    // },
                    // {
                    //     model: db.Image,
                    // },
                ],
                order: [["createdAt", "DESC"]],
                limit: parseInt(req.query.limit, 10),
            });
            res.json(responseMessage({ success: true, message: "" }, boards));
        } catch (e) {
            console.error(e);
            next(e);
        }
    },
};
