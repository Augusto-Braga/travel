import { Router } from "express";
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} from "../controllers/userController";
import { validateEmail } from "../middleware/validateEmail";

const userRouter = Router();

userRouter.post("/users", validateEmail, createUser);
userRouter.get("/users", listUsers);
userRouter.delete("/users", deleteUser);
userRouter.put("/users", validateEmail, updateUser);

export default userRouter;
