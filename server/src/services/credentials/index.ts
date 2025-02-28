import db from '../../db/connection';
import logger from '../../helpers/winston';
import { encrypt } from '../../helpers/encrypt';
import { decrypt } from '../../helpers/decrypt';

export const addCredentials = async (user_id: string, service: string, username: string, password: string) => {
    try {
        const encryptedPassword = encrypt(password);
        const result = await db.table('credentials').insert({user_id, service, username, password: encryptedPassword}).returning('*');
        if(!result) {
            return {
                status: 0,
                data: null,
            };
        }
        return {
            status: 1,
            data: result
        };
    } catch (error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
};

export const getCredentials = async (user_id: string) => {
    try {
        const result = await db.table('credentials').select('*').where({user_id});
        if(!result) {
            return {
                status: 0,
                data: null,
            };
        }
        return {
            status: 1,
            data: result
        };
    } catch (error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
};

export const deleteCredentials = async (user_id: string, id: string) => {
    try {
        const result = await db.table('credentials').where({user_id, id}).delete();
        if(!result) {
            return {
                status: 0,
                data: null,
            };
        }
        return {
            status: 1,
            data: result
        };
    } catch (error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
};

export const updateCredentials = async (user_id: string, id: string, service: string, username: string, password: string) => {
    try {
        const encryptedPassword = encrypt(password);
        const result = await db.table('credentials').where({user_id, id}).update({service, username, password: encryptedPassword}).returning('*');
        if(!result) {
            return {
                status: 0,
                data: null,
            };
        }
        await db.table('credentials').where({user_id, id}).update({updated_at: new Date()});
        return {
            status: 1,
            data: result
        };
    } catch (error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
};

export const getDecryptedPassword = async (user_id: string, id: string) => {
    try {
        const result = await db.table('credentials').select('password').where({user_id, id});
        if(!result) {
            return {
                status: 0,
                data: null,
            };
        }
        const decryptedPassword = decrypt(JSON.parse(result[0].password));
        return {
            status: 1,
            data: decryptedPassword
        };
    } catch (error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
};