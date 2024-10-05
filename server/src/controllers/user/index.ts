import { Request, Response } from "express";
import { getUserData } from "../../services/user";

export const getUser = async (req: Request, res: Response) => {
    //@ts-ignore
    const payload = req?.token;
    const user = await getUserData(payload);
    res.json(user);
};
