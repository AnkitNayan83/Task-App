import { NextFunction, Request, Response } from "express";
import db from "../utils/db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { phone_number } = req.body;
    if (!phone_number) return next({ message: "phone number is required", status: 400 });

    const user = await db.user.findUnique({
        where: {
            phone_number: phone_number as string,
        },
    });

    if (!user) return next({ message: "no user with this number exists", status: 404 });

    const token = jwt.sign(
        {
            userId: user.id,
        },
        process.env.JWT_SECRET!,
        {
            algorithm: "HS256",
            expiresIn: "7d",
        }
    );

    res.status(200).json({
        token,
        user,
    });
};
