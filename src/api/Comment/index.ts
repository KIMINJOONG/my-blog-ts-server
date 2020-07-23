import { Router } from "express";
import commentController from "./controller";
import { isLoggedIn } from "../../utils/auth";

const router = Router();

router.post("/:boardId", isLoggedIn, commentController.create);
router.get("/:boardId", commentController.index);

export default router;
