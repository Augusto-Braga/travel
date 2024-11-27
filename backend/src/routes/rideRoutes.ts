import { Router } from "express";
import {
  listDrivers,
  listRides,
  rideConfirm,
  rideEstimate,
} from "../controllers/rideController";

const rideRouter = Router();

rideRouter.post("/ride/estimate", rideEstimate);
rideRouter.post("/ride/confirm", rideConfirm);
rideRouter.get("/ride", listRides);
rideRouter.get("/drivers", listDrivers);

export default rideRouter;
