import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js";
import cookieParser from "cookie-parser";
import taskRoute from "./routes/task.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);

app.use("/api/auth", authRoute);
app.use("/api/tasks", taskRoute);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      console.log(err);
    });
});
