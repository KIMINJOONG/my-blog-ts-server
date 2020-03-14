import { Router } from "express";
import userController from "./controller";

const router = Router();

router.post("/", userController.create);

export default router;
