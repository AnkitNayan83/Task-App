import express from "express";
import { userAuth } from "../middleware/authMiddleware";
import { createTask, deleteTask, getTask, updateTask } from "../controller/taskController";

const router = express.Router();

router.post("/", userAuth, createTask);
router.get("/", userAuth, getTask);
router.put("/:id", userAuth, updateTask);
router.delete("/:id", userAuth, deleteTask);

export default router;
