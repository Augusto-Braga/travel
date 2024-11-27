import express from "express";
import userRouter from "./routes/userRoutes";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/authRoutes";
import rideRouter from "./routes/rideRoutes";

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/", rideRouter);

app.listen(PORT, () => {
  console.log(`Server is running!!`);
});
