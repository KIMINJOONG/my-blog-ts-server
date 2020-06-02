import { Router, Request, Response, NextFunction } from "express";
import hashtagController from "./controller";

const router = Router();

router.get("/:tag", hashtagController.show);
router.get("/", hashtagController.index);

export default router;
