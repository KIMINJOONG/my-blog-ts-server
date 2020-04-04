import { Router } from "express";
import userController from "./controller";
import { isLoggedIn } from "../../utils/auth";

const router = Router();

router.get("/me", isLoggedIn, userController.me);
router.post("/", userController.create);
router.get("/", userController.index);
router.get("/:id", userController.detail);
router.put("/:id", userController.update);
router.delete("/:id", userController.destroy);
router.post("/login", userController.login);

export default router;
