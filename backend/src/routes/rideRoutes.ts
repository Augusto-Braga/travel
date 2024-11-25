import { Router } from "express";
import {
  listRides,
  rideConfirm,
  rideEstimate,
} from "../controllers/rideController";

const rideRouter = Router();

rideRouter.post("/ride/estimate", rideEstimate);
rideRouter.post("/ride/confirm", rideConfirm);
rideRouter.get("/ride", listRides);

export default rideRouter;
