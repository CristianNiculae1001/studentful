import { Request, Response } from "express";
import { addNote, getNotes } from "../../services/notes";

export const addNoteController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const noteData = req?.body;
    const addedCatalogData = await addNote({user_id, ...noteData});
    res.json(addedCatalogData);
};

export const getNotesController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const page = req?.query?.page;
    const limit = req?.query?.limit;
    //@ts-ignore
    const catalog = await getNotes(user_id, page, limit);
    res.json(catalog);
};