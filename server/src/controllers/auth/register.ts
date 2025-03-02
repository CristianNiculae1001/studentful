import { Request, Response } from "express";
import type { VerifyTokenPayload, UserPayload } from '../../types/register';
import { verifyToken, register as registerService } from '../../services/auth/register';

export const verifyCode = async (req: Request<{}, {}, VerifyTokenPayload>, res: Response) => {
    const result = await verifyToken(req.body);
    res.json(result);
};

export const register = async (req: Request<{}, {}, UserPayload>, res: Response) => {
    const result = await registerService(req.body);
    res.json(result);
};