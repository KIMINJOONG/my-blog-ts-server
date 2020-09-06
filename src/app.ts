import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import users from "./api/User";
import boards from "./api/Board";
import hashtags from "./api/Hashtag";
import categories from "./api/Category";
import images from "./api/Image";
import comments from "./api/Comment";
import likes from "./api/Like";
import { responseMessage } from "./responsesMessage";
import User from "./config/models/User";
import cors from "cors";
import { sequelize } from "./config/config";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import expressSession from "express-session";

dotenv.config();
const app = express();
const prod = process.env.PRODUCTION;

if (prod === "true") {
  app.use(morgan("combined"));
  app.use(
    cors({
      origin: /kohubi\.xyz$/,
      credentials: true,
    }),
  );
} else {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
}

app.use(cookieParser(process.env.COOKIE_SECRET));
app.set("trust proxy", 1);
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET!,
    cookie: {
      httpOnly: true,
      secure: prod === "true", // https를 쓸 때 true
      domain: prod === "true" ? "kohubi.xyz" : "localhost",
    },
  }),
);
app.use("/", express.static("uploads"));
sequelize.sync({ force: false, alter: true });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export interface Err extends Error {
  status: number;
  data?: any;
}
// catch 404 and forward to error handler
// app.use((req, res, next) => {
//     console.log("에러 들어옴");
//     let err = new Error("Not Found") as Err;
//     err.status = 404;
//     next(err);
// });

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

app.get("/", (req, res) => {
  return res.send("api");
});
app.use("/users", users);
app.use("/boards", boards);
app.use("/hashtags", hashtags);
app.use("/images", images);
app.use("/categories", categories);
app.use("/comments", comments);
app.use("/likes", likes);

// error handle
app.use((err: Err, req: Request, res: Response, next: NextFunction) => {
  // render the error page
  res.status(err.status || 500);

  res.json(
    responseMessage(
      {
        success: false,
        message: err.message,
      },
      err.data,
    ),
  );
});

app.listen(4000, () => {
  console.log("start");
});

export default app;
