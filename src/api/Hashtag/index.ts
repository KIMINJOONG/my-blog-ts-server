import { Router, Request, Response, NextFunction } from "express";
import hashtagController from "./controller";

const router = Router();

router.get("/:tag", hashtagController.index);

export default router;
