import { Router } from "express";
import categoryController from "./controller";

const router = Router();

router.get("/", categoryController.index);
router.post("/", categoryController.create);
router.delete("/:id", categoryController.destroy);

export default router;
