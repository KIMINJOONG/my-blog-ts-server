import { Router } from "express";
import categoryController from "./controller";

const router = Router();

router.get("/", categoryController.index);
router.post("/", categoryController.create);

export default router;
