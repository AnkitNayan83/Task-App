import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import taskRoutes from "./routes/taskRoutes";
import authRoutes from "./routes/authRoute";
import subTaskRoutes from "./routes/subTaskRoutes";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { scheduleCalls } from "./corn jobs/makeCalls";
import { scheduleUpdatePriority } from "./corn jobs/updatePriority";

dotenv.config();
const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/sub-task", subTaskRoutes);

app.get("*", (req, res) => {
    res.send("<h1>404 Route not found</h1>");
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

scheduleCalls();
scheduleUpdatePriority();
