import db from '../../db/connection';
import logger from '../../helpers/winston';

export const addCatalogData = async (catalogData: Record<string, unknown>) => {
    try {
        const {user_id, catalog} = catalogData;
        const existingCatalog = await db.table('catalog').select('*').where({user_id});
        let result = null;
        if(existingCatalog.length === 0) {
            result = await db.table('catalog').insert({user_id, data: JSON.stringify([catalog])}).returning('*');
        } else {
            const currentCatalog = existingCatalog[0]?.data;
            currentCatalog.push(catalog);
            result = await db.table('catalog').where({user_id}).update('data', JSON.stringify(currentCatalog));
        }
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

export const updateCatalogData = async (updatedCatalogData: Record<string, unknown>) => {
    try {
        const {user_id, catalog} = updatedCatalogData;
        const result = await db.table('catalog').where({user_id}).update('data', JSON.stringify(catalog));
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