import { Request, Response } from "express";
import {getLastLink, getLastNote, getCatalogStats} from '../../services/homepage/index';

export const getLastNoteController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const note = await getLastNote(user_id);
    res.json(note);
};

export const getLastLinkController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const link = await getLastLink(user_id);
    res.json(link);
};

export const getCatalogStatsController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const stats = await getCatalogStats(user_id);
    res.json(stats);
};