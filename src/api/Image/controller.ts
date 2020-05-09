import { Request, Response, NextFunction } from "express";
import { responseMessage } from "../../responsesMessage";
import Image from "../../config/models/Image";

export default {
    upload: async (req: any, res: Response, next: NextFunction) => {
        return res.json(req.files.map((v: Express.Multer.File) => v.filename));
    },
    destroy: async (req: Request, res: Response, next: NextFunction) => {
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
            const image: Image = await Image.findOne({
                where: { id: parsedId },
            });
            if (!image) {
                error.status = 400;
                error.message = "존재하지않는 이미지입니다.";
                return next(error);
            }

            await image.destroy();
            return res.json(responseMessage({ success: true, message: "" }));
        } catch (error) {
            error.status = 404;
            return next(error);
        }
    },
};
