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

export const addNoteItem = async (note_id: number, description: string) => {
    try {
        const noteItem = await db('note_item').insert({note_id, description}).returning('*');
        return {
            status: 1,
            data: noteItem,
        };
    } catch (error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
};

export const getNoteItemsByNoteId = async (note_id: number) => {
    try {
        const noteItems = await db.table('note_item').select('*').where({note_id});
        return {
            status: 1,
            data: noteItems,
        };
    } catch (error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
};

export const deleteNoteItem = async (id: number) => {
    try {
        await db.table('note_item').where({id}).del();
        return {
            status: 1,
        };
    } catch (error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
};