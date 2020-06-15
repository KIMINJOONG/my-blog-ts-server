import { Router } from "express";
import boardController from "./controller";
import { isAdmin, isLoggedIn } from "../../utils/auth";

const router = Router();

router.post("/", isLoggedIn, isAdmin, boardController.create);
router.get("/", boardController.index);
router.get("/:id", boardController.detail);
router.put("/:id", isLoggedIn, isAdmin, boardController.update);
router.delete("/:id", isLoggedIn, isAdmin, boardController.destroy);

export default router;
