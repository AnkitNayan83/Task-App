import { NextFunction, Response } from "express";
import { AuthRequest } from "../utils/type";
import db from "../utils/db";
import { StatusType } from "@prisma/client";

export const createSubTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return next({ message: "no user found", status: 401 });
        }
        const { task_id } = req.body;
        if (!task_id) return next({ message: "task id not found", status: 400 });

        const subTask = await db.subTask.create({
            data: {
                task_id: Number(task_id),
            },
        });

        res.status(201).json({
            success: true,
            messsage: "sub task created",
            subTask,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getSubTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const { task_id } = req.query;

        if (!user) {
            return next({ message: "no user found", status: 401 });
        }
        const queryObject: any = {
            task: {
                user_id: user.id,
            },
            deletedAt: null,
        };

        if (task_id) {
            queryObject.task_id = Number(task_id);
        }

        const subTasks = await db.subTask.findMany({
            where: queryObject,
            include: {
                task: true,
            },
        });

        res.status(200).json(subTasks);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const updateSubTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        return next({ message: "no user found", status: 401 });
    }
    const { id } = req.params;

    if (!id) return next({ message: "ID of the task not found", status: 400 });

    const subTask = await db.subTask.update({
        where: {
            id: Number(id),
        },
        data: {
            status: 1,
        },
    });

    const task = await db.task.findFirst({
        where: {
            id: subTask.task_id,
        },
        include: {
            subTasks: true,
        },
    });

    if (!task) return next({ message: "No task with this id exists", status: 404 });

    let updated_task_status: StatusType = StatusType.DONE;

    for (const subTask of task.subTasks) {
        if (subTask.status === 0) {
            updated_task_status = StatusType.IN_PROGRESS;
            break;
        }
    }

    if (task.status !== updated_task_status) {
        await db.task.update({
            where: {
                id: task.id,
            },
            data: {
                status: updated_task_status,
            },
        });
    }

    res.status(200).json({ message: "Subtask updated successfully" });
};

export const deleteSubTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return next({ message: "no user found", status: 401 });
        }
        const { id } = req.params;

        if (!id) return next({ message: "ID of the task not found", status: 400 });

        await db.subTask.update({
            where: {
                id: Number(id),
            },
            data: {
                deletedAt: new Date(),
            },
        });

        res.status(200).json({
            success: true,
            message: "sub task deleted",
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
