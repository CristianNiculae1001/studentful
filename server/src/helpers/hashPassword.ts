import bcrypt from 'bcrypt';
import logger from './winston';

const SALT_ROUNDS = 10;

export const generateHashedPassword = async (password: string) => {
    try {
        const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
        return hashPassword;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

export const comparePasswords = async (password: string, hashPassword: string) => {
    try {
        const result = await bcrypt.compare(password, hashPassword);
        return result;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};
