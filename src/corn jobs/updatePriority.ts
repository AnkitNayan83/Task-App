import corn from "node-cron";
import db from "../utils/db";
import { differenceInDays } from "date-fns";

export const scheduleUpdatePriority = () => {
    corn.schedule("0 0 * * *", async () => {
        try {
            const tasks = await db.task.findMany();
            const today = new Date();

            tasks.forEach(async (task) => {
                const dueDate = task.due_date;
                const daysDiff = differenceInDays(dueDate, today);

                if (daysDiff >= 0) {
                    let priority: number;

                    if (daysDiff === 0) priority = 0;
                    else if (daysDiff >= 1 && daysDiff <= 2) priority = 1;
                    else if (daysDiff >= 3 && daysDiff <= 4) priority = 2;
                    else priority = 3;

                    await db.task.update({
                        where: {
                            id: task.id,
                        },
                        data: {
                            priority,
                        },
                    });
                }
            });
        } catch (error) {
            throw new Error("Error in updating priority [CORN]");
        }
    });
};
