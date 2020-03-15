import { Router } from "express";
import userController from "./controller";

const router = Router();

router.post("/", userController.create);
router.get("/", userController.index);
router.get("/:id", userController.detail);
router.put("/:id", userController.update);
router.delete("/:id", userController.destroy);

export default router;
