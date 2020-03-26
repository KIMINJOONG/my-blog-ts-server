import { Router } from "express";
import boardController from "./controller";

const router = Router();

router.post("/", boardController.create);
router.get("/", boardController.index);
router.get("/:id", boardController.detail);
router.put("/:id", boardController.update);
router.delete("/:id", boardController.destroy);

export default router;
