import { Router, type IRouter } from "express";
import aiRouter from "./ai";
import healthRouter from "./health";
import resumeRouter from "./resume";

const router: IRouter = Router();

router.use(aiRouter);
router.use(resumeRouter);
router.use(healthRouter);

export default router;
