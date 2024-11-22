import { Router } from "express";
import { getLoggedUser, loginUser } from "../controllers/authController";
import { validateJwtToken } from "../middleware/validateJwtToken";

const authRouter = Router();

authRouter.post("/login", loginUser);
authRouter.get("/loggedUser", validateJwtToken, getLoggedUser);

export default authRouter;
