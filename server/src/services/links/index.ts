import db from '../../db/connection';
import logger from '../../helpers/winston';
import crypto from 'crypto';

const generateShortLabel = () => crypto.randomBytes(3).toString('hex');

export const createLink = async (payload: Record<string, unknown>) => {
    try {
        const { user_id, title, url, label, access, allowed_emails } = payload;

        let shortLabel = label;
        if (access === 'public') {
            shortLabel = generateShortLabel();
        }

        const [link] = await db('link')
            .insert({ user_id, url, label: shortLabel, access })
            .returning('*');

        if (access === 'restricted' && Array.isArray(allowed_emails) && allowed_emails.length) {
            const guestUsers = await db('users').whereIn('email', allowed_emails).select('id');

            const accessData = guestUsers.map(guest => ({
                link_id: link.id,
                author_id: user_id,
                guest_id: guest.id,
            }));

            if (accessData.length) {
                await db('link_access').insert(accessData);
            }
        }

        return { status: 1, data: link };
    } catch (error) {
        logger.error(error);
        return { status: 0, message: error };
    }
};

export const getAllLinks = async (user_id: number) => {
    try {
        const links = await db('link').where({ user_id }).select('*');

        const restrictedLinks = links.filter(link => link.access === 'restricted');
        const restrictedIds = restrictedLinks.map(link => link.id);

        let emailMapping: Record<number, string[]> = {};

        if (restrictedIds.length > 0) {
            const emails = await db('link_access')
                .join('users', 'users.id', '=', 'link_access.guest_id')
                .whereIn('link_id', restrictedIds)
                .select('link_access.link_id', 'users.email');

            emailMapping = emails.reduce((acc, entry) => {
                if (!acc[entry.link_id]) {
                    acc[entry.link_id] = [];
                }
                acc[entry.link_id].push(entry.email);
                return acc;
            }, {} as Record<number, string[]>);
        }

        const enrichedLinks = links.map(link => ({
            ...link,
            allowed_emails: link.access === 'restricted' ? emailMapping[link.id] || [] : undefined,
        }));

        return { status: 1, data: enrichedLinks };
    } catch (error) {
        logger.error(error);
        return { status: 0, message: "Eroare la obținerea link-urilor" };
    }
};

export const updateLink = async (id: number, user_id: number, data: Record<string, unknown>) => {
    try {
        const { access, url, label, allowed_emails } = data;

        const [updatedLink] = await db('link')
            .where({ id, user_id })
            .update({ access, url, label })
            .returning('*');

        if (access === 'restricted') {
            if (Array.isArray(allowed_emails)) {
                await db('link_access')
                    .where({ link_id: id })
                    .whereNotIn('guest_id', function () {
                        this.select('id').from('users').whereIn('email', allowed_emails);
                    })
                    .del();

                const guestUsers = await db('users')
                    .whereIn('email', allowed_emails)
                    .select('id');

                const existingEmails = await db('link_access')
                    .where({ link_id: id })
                    .select('guest_id');

                const existingIds = existingEmails.map(e => e.guest_id);
                const newGuests = guestUsers.filter(guest => !existingIds.includes(guest.id));

                const accessData = newGuests.map(guest => ({
                    link_id: id,
                    author_id: user_id,
                    guest_id: guest.id,
                }));

                if (accessData.length) {
                    await db('link_access').insert(accessData);
                }
            }
        } else {
            await db('link_access').where({ link_id: id }).del();
        }

        return { status: 1, data: updatedLink };
    } catch (error) {
        logger.error(error);
        return { status: 0, message: error };
    }
};

export const deleteLink = async (id: number, user_id: number) => {
    try {
        await db('link_access').where({ link_id: id }).del();
        await db('link').where({ id, user_id }).del();
        return { status: 1, message: "Link șters cu succes" };
    } catch (error) {
        logger.error(error);
        return { status: 0, message: error };
    }
};

export const redirectLink = async (label: string, user_id?: number) => {
    try {
        const link = await db('link').where({ label }).first();

        if (!link) return { status: 0, message: "Link inexistent" };
        if(link.access === 'public') return { status: 1, data: link.url };

        const user = await db('users').where({ id: user_id }).first();
        const user_email = user ? user.email : null;

        if (!user_email && link.access !== 'public') {
            return { status: 0, message: "Eroare: utilizator inexistent" };
        }

        if (link.access === 'private' && link.user_id !== user_id) {
            return { status: 0, message: "Acces restricționat" };
        }

        if (link.access === 'restricted') {
            const hasAccess = await db('link_access')
                .join('users', 'users.id', '=', 'link_access.guest_id')
                .where({ link_id: link.id })
                .andWhere('users.email', user_email)
                .first();

            if (!hasAccess) {
                return { status: 0, message: "Acces restricționat" };
            }
        }

        return { status: 1, data: link.url };
    } catch (error) {
        logger.error(error);
        return { status: 0, message: "Eroare server" };
    }
};