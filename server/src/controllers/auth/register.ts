import { Request, Response } from "express";
import type { VerifyTokenPayload, UserPayload } from '../../types/register';
import { verifyToken, register as registerService } from '../../services/auth/register';
import cookie from 'cookie';

export const verifyCode = async (req: Request<{}, {}, VerifyTokenPayload>, res: Response) => {
    const result = await verifyToken(req.body);
    if(result.token) {
        return res.setHeader('Set-Cookie', cookie.serialize('auth', result.token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
        }));
    }
    res.json(result);
};

export const register = async (req: Request<{}, {}, UserPayload>, res: Response) => {
    const result = await registerService(req.body);
    res.json(result);
};