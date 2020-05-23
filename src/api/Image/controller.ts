import { Request, Response, NextFunction } from "express";
import { responseMessage } from "../../responsesMessage";
import Image from "../../config/models/Image";
import { removeMulterImage } from "../../utils/file";

export default {
    upload: async (req: any, res: Response, next: NextFunction) => {
        // console.log("넘어옴");
        // for (let file of req.files) {
        //     const { key, originalname } = file;
        //     Image.create({key, name: originalname});
        // }
        return res.json(req.files.map((v: Express.MulterS3.File) => v.key));
    },
    destroy: async (req: Request, res: Response, next: NextFunction) => {
        const {
            params: { imageKey },
        } = req;
        const fullFileName =
            "https://kohubi-blog.s3.ap-northeast-2.amazonaws.com/images/" +
            imageKey;
        // try {
        //     await Image.destroy({ where: { key: imageKey } });
        // } catch (error) {
        //     // 게시글 수정에서 이미지 파일 삭제가 아닌 업로드중 이미지 삭제는 당연히 에러이므로 상관x
        // }
        const param = {
            Bucket: "kohubi-test/images",
            Key: imageKey,
        };

        const result = await removeMulterImage(param);
        return res.status(200).json(result);
    },
};
