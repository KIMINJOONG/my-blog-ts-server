import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import users from "./api/User";
import boards from "./api/Board";
import hashtags from "./api/Hashtag";
import { responseMessage } from "./responsesMessage";
import User from "./models/User";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);
app.use(morgan("dev"));
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

mongoose
    .connect("mongodb://localhost:27017/my-blog-ts", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("mongo db success"))
    .catch((err) => console.log(err));

app.use("/users", users);
app.use("/boards", boards);
app.use("/hashtags", hashtags);

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
            err.data
        )
    );
});

app.listen(4000, () => {
    console.log("start");
});

export default app;
