import express from "express";
import { userAuth } from "../middleware/authMiddleware";
import {
    createSubTask,
    deleteSubTask,
    getSubTask,
    updateSubTask,
} from "../controller/subTaskController";

const router = express.Router();

router.post("/", userAuth, createSubTask);
router.get("/", userAuth, getSubTask);
router.put("/:id", userAuth, updateSubTask);
router.delete("/:id", userAuth, deleteSubTask);

export default router;
