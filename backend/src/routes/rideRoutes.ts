import { Router } from "express";
import { rideEstimate } from "../controllers/rideController";

const rideRouter = Router();

rideRouter.post("/ride/estimate", rideEstimate);

export default rideRouter;
