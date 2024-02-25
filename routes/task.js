import express from "express";
import { verifyToken } from "../verifyToken.js";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/task.js";

const router = express.Router();

router.get("/", verifyToken, getTasks);
router.get("/:taskId", verifyToken, getTask);
router.post("/create", verifyToken, createTask);
router.delete("/:taskId", verifyToken, deleteTask);
router.put("/:taskId", verifyToken, updateTask);

export default router;
