import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
  region: "ap-northeast-1",
});

export const multerImages = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "kohubi-renual-blog/images",
  }),
});

export const removeMulterImage = (param: any) => {
  s3.deleteObject(param, (err, data) => {
    if (err) {
      console.error(err);
      return err;
    } else {
      return data;
    }
  });
};
