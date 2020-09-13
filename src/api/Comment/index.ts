import { Router } from "express";
import commentController from "./controller";
import { isLoggedIn, isNotLoggedIn } from "../../utils/auth";

const router = Router();

router.put(
    "/:boardId/:commentId",
    process.env.PRODUCTION ? isLoggedIn : isNotLoggedIn,
    commentController.update
);
router.delete(
    "/:boardId/:commentId",
    process.env.PRODUCTION ? isLoggedIn : isNotLoggedIn,
    commentController.destroy
);
router.post("/:boardId", isLoggedIn, commentController.create);
router.get("/:boardId", commentController.index);

export default router;
