import db from "../../db/connection";
import logger from "../../helpers/winston";

export const addEvent = async (eventData: Record<string, unknown>) => {
    try {
        const { user_id, title, description, start, end, all_day } = eventData as {
            user_id: number;
            title: string;
            description: string;
            start: string;
            end: string;
            all_day: boolean;
        };

        const existingEvents = await db.table("events").select("*").where({ user_id });
        let result = null;

        if (existingEvents.length === 0) {
            result = await db
                .table("events")
                .insert({ user_id, title, description, start, end, all_day })
                .returning("*");
        } else {
            result = await db
                .table("events")
                .insert({ user_id, title, description, start, end, all_day })
                .returning("*");
        }

        if (!result) {
            return {
                status: 0,
                data: null,
            };
        }
        return {
            status: 1,
            data: result,
        };
    } catch (error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
};

export const getEvents = async (user_id: string) => {
    try {
        const result = await db.table("events").select("*").where({ user_id });
        if (!result) {
            return {
                status: 0,
                data: null,
            };
        }
        return {
            status: 1,
            data: result,
        };
    } catch (error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
};

export const deleteEvent = async (event_id: number, user_id: number) => {
    try {
        const result = await db.table("events").where({ id: event_id, user_id }).del();
        if (!result) {
            return {
                status: 0,
                data: null,
            };
        }
        return {
            status: 1,
            data: "Event deleted successfully",
        };
    } catch (error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
};

export const updateEvent = async (event_id: number, user_id: number, updateData: Record<string, unknown>) => {
    try {
        const { title, description } = updateData;
        const result = await db.table("events").where({ id: event_id, user_id }).update({ title, description }).returning("*");

        if (!result.length) {
            return {
                status: 0,
                data: null,
            };
        }
        return {
            status: 1,
            data: result[0],
        };
    } catch (error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
};
