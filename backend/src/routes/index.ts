import express from "express";
import weatherQueriesRouter from "./weatherQueries";
import weatherDataRouter from "./weatherData";

const router = express.Router();

router.use("/wq", weatherQueriesRouter);
router.use("/wd", weatherDataRouter);

export default router;
