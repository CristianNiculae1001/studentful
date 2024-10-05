import db from '../../db/connection';
import type { TokenPayload } from '../../types/tokenPayload';
import logger from '../../helpers/winston';

export const getUserData = async (payload: TokenPayload) => {
    try {
        const {id} = payload;
        const user = await db.table('users').select('first_name', 'last_name', 'email', 'id').where({id, active: true});
        if(!user) {
            return {
                status: 0,
                data: null,
            };
        }
        return {
            status: 1,
            data: user
        };
    } catch (error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
}