import sgMail from '@sendgrid/mail';
import type { MailParams } from '../types/sendMail';
import logger from './winston';

sgMail.setApiKey(process.env.MAIL_API_KEY!)

export const sendMail = async (mailParams: MailParams) => {
    try {
        const message = {
            to: mailParams.email, // Change to your recipient
            from: process.env.SENDER_MAIL!, // Change to your verified sender
            subject: 'Verify your email address',
            text: `Verification token: ${mailParams.verificationToken}. It's expiring in 5 minutes.`,
        };
        await sgMail.send(message);
        return {
            status: 1,
            message: 'Email sent',
        };
    } catch (error) {
        logger.error(error);
        throw error;
    }
};