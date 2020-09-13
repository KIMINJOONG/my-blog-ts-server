import { Router } from "express";
import commentController from "./controller";
import { isLoggedIn, isNotLoggedIn } from "../../utils/auth";

const router = Router();

router.put("/:boardId/:commentId", isLoggedIn, commentController.update);
router.delete("/:boardId/:commentId", isLoggedIn, commentController.destroy);
router.post("/:boardId", isLoggedIn, commentController.create);
router.get("/:boardId", commentController.index);

export default router;
