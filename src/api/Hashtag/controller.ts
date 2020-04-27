import { Request, Response, NextFunction } from "express";
import { responseMessage } from "../../responsesMessage";
import Board from "../../config/models/Board";

export default {
    index: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                params: { tag },
            } = req;
            if (!tag) {
                let error = {
                    status: -1,
                    data: null,
                    message: "",
                };
                error.status = 404;
                error.message = "존재하지 않는 게시글입니다.";
                return next(error);
            }
            // const boards = await Board.f({}).populate({
            //     path: "hashtags",
            //     match: { tag },
            //     select: "tag"
            // });
            return res.json(responseMessage({ success: true, message: "" }));
        } catch (error) {
            console.log(error);
            return next(error);
        }
    },
};
