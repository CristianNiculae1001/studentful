import { Request, Response } from "express";
import { LoginPayload } from "../../types/login";
import { login as loginService } from "../../services/auth/login";
import cookie from 'cookie';

export const login = async (req: Request<{}, {}, LoginPayload>, res: Response) => {
    const result = await loginService(req.body);
    if(result.token) {
        return res.setHeader('Set-Cookie', cookie.serialize('auth', result.token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
        })).json(result);
    }
    res.json({status: 0, message: 'Bad request'});
};