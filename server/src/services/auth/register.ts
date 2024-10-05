import db from '../../db/connection';
import type { UserPayload, VerifyTokenPayload } from '../../types/register';
import * as yup from 'yup';
import logger from '../../helpers/winston';
import { generateHashedPassword } from '../../helpers/hashPassword';
import { generateVerificationToken } from '../../helpers/verificationToken';
import { sendMail } from '../../helpers/sendMail';
import * as jwt from 'jsonwebtoken';

const userPayloadSchema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required(),
});

const verificationTokenPayloadSchema = yup.object({
    email: yup.string().email().required(),
    token: yup.string().length(4).matches(/^[0-9]*$/),
});

export async function verifyToken (verificationTokenPayload: VerifyTokenPayload) {
    try {
        await verificationTokenPayloadSchema.validate(verificationTokenPayload);
        const user = await db.table('users').select('verification_token', 'token_expiration_date', 'email').where({email: verificationTokenPayload.email});
        if(user.length !== 0) {
            if(user[0].verification_token === verificationTokenPayload.token) {                
                if(new Date(Date.now()) < user[0].token_expiration_date) {
                    await db.table('users').update({active: true}).where({email: user[0].email, verification_token: '', token_expiration_date: ''});
                    const token = jwt.sign({ email: user[0].email, id: user[0].id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
                    return {
                        status: 1,
                        token,
                    };
                } else {
                    return {
                        status: 0,
                        message: 'Verification Token Expired',
                    };
                }
            } else {
                return {
                    status: 0,
                    message: 'Wrong Verification Token',
                };
            }
        } else {
            return {
                status: 0,
                message: 'User not found',
            };
        }
    } catch (error) {
        console.log(error);
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
};

export async function register (userPayload: UserPayload) {
    try {
        const { firstName, lastName, email, password } = userPayload;
        const user = await userPayloadSchema.validate({firstName, lastName, email, password});
        const existingUser = await db.table('users').select('*').where({email});
        if(existingUser.length !== 0 && existingUser[0].active) {
            return {
                status: 0,
                message: 'User already exists',
            };
        } else {
            const hashPassword = await generateHashedPassword(user.password);
            const verificationToken = generateVerificationToken(); 
            const verificationTokenExpirationDate = new Date(Date.now() + 60000 * 5);
            const mailParams = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                verificationToken,
            };
            if(existingUser.length !== 0 && !existingUser[0].active) {
                await db.table('users').update({verification_token: verificationToken, token_expiration_date: verificationTokenExpirationDate}).where({email: user.email});
            }
            await sendMail(mailParams);
            const output = (existingUser.length !== 0 && !existingUser[0]?.active) ? existingUser[0] : await db.table('users').insert({first_name: firstName, last_name: lastName, email, password: hashPassword, verification_token: verificationToken, token_expiration_date: verificationTokenExpirationDate}).returning('*');
            
            return {
                status: 1,
                data: output,
            }
        }
    } catch (error) {
        console.log(error);
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
};