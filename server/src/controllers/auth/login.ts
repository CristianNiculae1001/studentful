import { Request, Response } from "express";
import { LoginPayload } from "../../types/login";
import { login as loginService, forgotPassword as forgotPasswordService } from "../../services/auth/login";
import cookie from 'cookie';

export const login = async (req: Request<{}, {}, LoginPayload>, res: Response) => {
    const result = await loginService(req.body);
    if(result.token) {
        return res.setHeader('Set-Cookie', cookie.serialize('auth', result.token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
        })).json(result);
    }
    res.status(400).json({status: 0, message: result.message ?? 'Bad Request'});
};

export const forgotPassword = async (req: Request<{}, {}, {email: string}>, res: Response) => {
    const result = await forgotPasswordService(req.body.email);
    if(result.status) {
        return res.status(200).json(result);
    }
    res.status(400).json({status: 0, message: result.message ?? 'Bad Request'});
};