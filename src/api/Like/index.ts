import { Router } from "express";
import likeController from "./controller";
import { isLoggedIn } from "../../utils/auth";

const router = Router();

router.post("/:boardId", isLoggedIn, likeController.create);
router.get("/:boardId", likeController.index);

export default router;
