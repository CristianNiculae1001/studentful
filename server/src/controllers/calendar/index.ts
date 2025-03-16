import { Request, Response } from "express";
import { addEvent, getEvents, deleteEvent, updateEvent } from "../../services/calendar/index";

export const createEvent = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const eventData = req?.body;
    const addedEvent = await addEvent({ user_id, ...eventData });
    res.json(addedEvent);
};

export const fetchEvents = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const events = await getEvents(user_id);
    res.json(events);
};

export const removeEvent = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const { id } = req.params;
    const deletedEvent = await deleteEvent(Number(id), user_id);
    res.json(deletedEvent);
};

export const editEvent = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const { id } = req.params;
    const updateData = req.body;
    const updatedEvent = await updateEvent(Number(id), user_id, updateData);
    res.json(updatedEvent);
};