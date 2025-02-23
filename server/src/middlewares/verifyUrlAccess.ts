import { NextFunction, Request, Response } from "express";
import { redirectLink } from "../services/links";

export const verifyUrlAccess = async (req: Request, res: Response, next: NextFunction) => {
    const { label } = req.params;

    if (!label) {
        return res.status(400).json({ status: 0, message: "Lipsește label-ul" });
    }

    const result = await redirectLink(label);

    if (result.status === 1) {
        return res.json(result);
    }

    return next();
};
