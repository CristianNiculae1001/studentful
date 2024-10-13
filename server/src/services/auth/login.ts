import db from '../../db/connection';
import * as yup from 'yup';
import logger from '../../helpers/winston';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { LoginPayload } from '../../types/login';
import { sendMail } from '../../helpers/sendMail';
import crypto from 'crypto';

const loginPayloadSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required(),
});

export async function login(payload: LoginPayload) {
    try {
        await loginPayloadSchema.validate(payload);
        const email = payload.email;
        const password = payload.password;
        const userByEmail = await db.table('users').select('id', 'email', 'password').where({email, active: true});
        if(userByEmail.length === 0) {
            return {
                status: 0,
                message: 'Email or password are incorrect',
            }
        }
        const verifyPassword = await bcrypt.compare(password, userByEmail[0]?.password);
        if(!verifyPassword) {
            return {
                status: 0,
                message: 'Password is not correct',
            };
        }
        const token = jwt.sign({ email: userByEmail[0].email, id: userByEmail[0].id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        return {
            status: 1,
            token,
        };
    } catch(error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        }
    }
}

export async function forgotPassword(email: string) {
    try {
        const userByEmail = await db.table('users').select('id', 'email', 'password').where({email, active: true});
        if(userByEmail.length === 0) {
            return {
                status: 0,
                message: 'Email or password are incorrect',
            }
        }
        const extension = crypto.randomBytes(64).toString('hex');
        const URL = `http://localhost:5173/change-password/${extension}${userByEmail[0]?.id}`;
        const response = await sendMail({subject: 'Password Change', text: `Click this link to reset your password: ${URL}`, email});
        return {
            status: 1,
            message: 'Email has been sent, check your email and follow the next steps.',
        };
    } catch(error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        }
    }
}