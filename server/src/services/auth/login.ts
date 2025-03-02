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
        const URL = `http://localhost:5173/change-password/${extension}/${userByEmail[0]?.id}`;
        await db.table('users').update({requested_reset_password: true}).where({email, active: true});
        const response = await sendMail({subject: 'Password Change', text: `Click this link to reset your password: ${URL}`, email});
        if(response?.status) {
            return {
                status: 1,
                message: 'Email has been sent, check your email and follow the next steps.',
            };
        } else {
            return {
                status: 0,
                message: 'Email has not been sent',
            };
        }
    } catch(error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        }
    }
}

export async function changePassword(payload: { password: string, id: string }) {
    try {
        const user = await db.table('users').select('id', 'email', 'password', 'requested_reset_password').where({id: payload.id});
        if(user.length === 0) {
            return {
                status: 0,
                message: 'User not found',
            }
        };
        if(!user[0]?.requested_reset_password) {
            return {
                status: 0,
                message: 'User has not requested to change password',
            }
        };
        const { password, id } = payload;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.table('users').update({password: hashedPassword, requested_reset_password: false}).where({id});
        return {
            status: 1,
            message: 'Password has been changed',
        };
    } catch(error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        }
    }
}

export async function updateAccountInfo(payload: { id: string, firstName: string, lastName: string }) {
    try {
        const { id, firstName, lastName } = payload;
        await db.table('users').update({first_name: firstName, last_name: lastName}).where({id});
        return {
            status: 1,
            message: 'Informatii actualizate cu succes',
        };
    } catch(error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        }
    }
}

export async function deleteAccount(id: string) {
    try {
        await db.transaction(async (trx) => {
            await trx.table('catalog').del().where({ user_id: id });
            await trx.table('note_item').whereIn('note_id', trx.table('note').select('id').where({ user_id: id })).del();
            await trx.table('note').del().where({ user_id: id });
            await trx.table('editor_modification').del().where({ user_id: id });
            await trx.table('link_access').del().where({ author_id: id });
            await trx.table('link_access').del().where({ guest_id: id });
            await trx.table('link').del().where({ user_id: id });
            await trx.table('credentials').del().where({ user_id: id });
            await trx.table('users').del().where({ id });
        });

        return {
            status: 1,
            message: 'Account has been deleted successfully',
        };
    } catch (error) {
        logger.error(error);
        return {
            status: 0,
            message: 'Error deleting account',
            error: error,
        };
    }
}