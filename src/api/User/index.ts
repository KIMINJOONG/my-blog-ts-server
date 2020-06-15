import { Router } from "express";
import userController from "./controller";
import { isLoggedIn, isNotLoggedIn, isAdmin } from "../../utils/auth";
import { joinValidator } from "../../utils/validator";

const router = Router();

router.get("/me", isLoggedIn, userController.me);
router.post("/", isNotLoggedIn, userController.create);
router.get("/", isLoggedIn, isAdmin, userController.index);
router.get("/:id", isLoggedIn, userController.detail);
router.put("/:id", isLoggedIn, userController.update);
router.delete("/:id", isLoggedIn, isAdmin, userController.destroy);
router.post("/login", isNotLoggedIn, joinValidator, userController.login);

export default router;
