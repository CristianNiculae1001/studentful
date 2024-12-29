import db from '../../db/connection';
import logger from '../../helpers/winston';

export const addNote = async (payload: Record<string, unknown>) => {
    try {
        const {user_id, title, tag} = payload;
        const note = await db('note').insert({user_id, title, tag}).returning('*');
        if(!note) {
            return {
                status: 0,
                data: null,
            };
        }
        return {
            status: 1,
            data: note
        };
    } catch (error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
}

// get notes paginated
export const getNotes = async (user_id: string, page: number, limit: number) => {
    try {
        const notes = await db.table('note').select('*').limit(limit).offset((page - 1) * limit).where({user_id});
        return {
            status: 1,
            data: notes,
        };
    } catch (error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
};