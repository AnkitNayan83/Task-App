import { NextFunction, Response } from "express";
import { AuthRequest } from "../utils/type";
import { differenceInDays, isPast, parseISO } from "date-fns";
import db from "../utils/db";
import { Prisma, StatusType } from "@prisma/client";

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return next({ message: "no user found", status: 401 });
        }

        const { title, description, due_date } = req.body;

        if (!title) return next({ message: "No title found", status: 400 });

        if (!description) return next({ message: "No description found", status: 400 });

        if (!due_date) return next({ message: "No due date found", status: 400 });

        const parsed_date = parseISO(due_date as string);

        if (isPast(parsed_date)) {
            return next({ message: "due date connot be a past date", status: 400 });
        }

        const daysDiff = differenceInDays(parsed_date, new Date());

        let priority: number;

        if (daysDiff === 0) priority = 0;
        else if (daysDiff >= 1 && daysDiff <= 2) priority = 1;
        else if (daysDiff >= 3 && daysDiff <= 4) priority = 2;
        else priority = 3;

        const task = await db.task.create({
            data: {
                title,
                description,
                due_date: parsed_date,
                priority,
                status: StatusType.TODO,
                user_id: user.id,
            },
        });

        res.status(201).json({
            success: true,
            message: "task created successfully",
            task,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return next({ message: "no user found", status: 401 });
        }

        const { priority, due_date, page } = req.query;
        const PAGE_SIZE = 5;
        let queryObject: any = {
            user_id: user.id,
            deletedAt: null,
        };

        if (priority) {
            queryObject.priority = Number(priority);
        }
        if (due_date) {
            const parsedDate = parseISO(due_date as string);
            queryObject.due_date = parsedDate;
        }

        const pageNo = Number(page) || 1;

        const pageOffset = (pageNo - 1) * PAGE_SIZE;

        const tasks = await db.task.findMany({
            where: queryObject,
            orderBy: {
                due_date: "asc",
            },
            skip: pageOffset,
            take: PAGE_SIZE,
        });

        res.status(200).json({
            success: true,
            tasks,
        });
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return next({ message: "no user found", status: 401 });
        }
        const { id } = req.params;
        if (!id) return next({ message: "ID of the task not found", status: 400 });

        const task = await db.task.findFirst({
            where: {
                id: Number(id),
            },
        });

        if (!task) return next({ message: "Task not found", status: 404 });

        const { due_date } = req.body;

        if (!due_date) return next({ message: "due date cannot be empty", status: 400 });

        const parsed_date = parseISO(due_date as string);

        if (isPast(parsed_date)) {
            return next({ message: "due date connot be a past date", status: 400 });
        }

        const daysDiff = differenceInDays(parsed_date, new Date());
        let priority: number;

        if (daysDiff === 0) priority = 0;
        else if (daysDiff >= 1 && daysDiff <= 2) priority = 1;
        else if (daysDiff >= 3 && daysDiff <= 4) priority = 2;
        else priority = 3;

        const updatedTask = await db.task.update({
            where: {
                id: Number(id),
            },
            data: {
                due_date: parsed_date,
                priority: priority,
            },
        });

        res.status(200).json({
            success: true,
            message: "task updated successfully",
            task: updateTask,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return next({ message: "no user found", status: 401 });
        }
        const { id } = req.params;
        if (!id) return next({ message: "ID of the task not found", status: 400 });

        await db.task.update({
            where: {
                id: Number(id),
            },
            data: {
                deletedAt: new Date(),
            },
        });
        res.status(200).json({
            success: true,
            message: "task deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
