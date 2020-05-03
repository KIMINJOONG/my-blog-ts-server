import { Request, Response, NextFunction } from "express";

export default {
    upload: async (req: any, res: Response, next: NextFunction) => {
        console.log(req.files);
        return res.json(req.files.map((v: Express.Multer.File) => v.filename));
    },
};
