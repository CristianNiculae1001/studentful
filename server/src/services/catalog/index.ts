import db from '../../db/connection';
import logger from '../../helpers/winston';

export const addCatalogData = async (catalogData: Record<string, unknown>) => {
    try {
        const {user_id, catalog} = catalogData;
        console.log(user_id, catalog);
        const result = await db.table('catalog').insert({user_id, data: JSON.stringify([catalog])}).returning('*');
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

export const getCatalogData = async (user_id: string) => {
    try {
        const result = await db.table('catalog').select('data').where({user_id});
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
}