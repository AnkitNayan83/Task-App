import corn from "node-cron";
import twilio from "twilio";
import db from "../utils/db";

const TWILIO_PHONE_NO = process.env.TWILIO_PHONE_NO!;
const TWILIO_ACCOUNT_ID = process.env.TWILIO_ACCOUNT_ID!;
const TWILIO_ACCOUNT_TOKEN = process.env.TWILIO_ACCOUNT_TOKEN!;

const client = twilio(TWILIO_ACCOUNT_ID, TWILIO_ACCOUNT_TOKEN);

export const scheduleCalls = () => {
    corn.schedule("1 0 * * *", async () => {
        const users = await db.user.findMany({
            orderBy: {
                priority: "asc",
            },
        });

        for (const user of users) {
            const pendingTasks = await db.task.findMany({
                where: {
                    user_id: user.id,
                    due_date: {
                        lt: new Date(),
                    },
                },
            });

            if (pendingTasks.length > 0) {
                await client.calls.create({
                    to: user.phone_number,
                    from: TWILIO_PHONE_NO,
                    url: "URL_TO_XML_FILE",
                });
            }
        }
    });
};
