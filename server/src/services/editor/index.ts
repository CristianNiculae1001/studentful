import db from '../../db/connection';
import logger from '../../helpers/winston';

export const addEditorChanges = async (user_id: string, editorData: Record<string, unknown>) => {
    try {
        const result = await db.table('editor_modification').insert({user_id, ...editorData as Record<string, unknown>}).returning('*');
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
        console.log(error);
        return {
            status: 0,
            message: error,
        };
    }
};

export const getEditorsChanges = async (user_id: string) => {
    try {
        const result = await db.table('editor_modification').select('*').where({user_id});
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

export const deleteEditorChanges = async (user_id: string, id: string) => {
    try {
        const result = await db.table('editor_modification').where({user_id, id}).delete();
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

export const getEditorChanges = async (user_id: string, id: string) => {
    try {
        const result = await db.table('editor_modification').select('*').where({user_id, id});
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

export const updateEditorChanges = async (user_id: string, id: string, data: Record<string, unknown>) => {
    try {
        const result = await db.table('editor_modification').where({user_id, id}).update(data as Record<string, unknown>).returning('*');
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