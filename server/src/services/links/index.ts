import db from '../../db/connection';
import logger from '../../helpers/winston';
import crypto from 'crypto';

const generateShortLabel = () => crypto.randomBytes(3).toString('hex');

export const createLink = async (payload: Record<string, unknown>) => {
    try {
        const { user_id, url, label, access, allowed_emails } = payload;

        let shortLabel = label;
        if (access === 'public') {
            shortLabel = generateShortLabel();
        }

        const existingRestrictedLinkAccess = await db('link_access').select('link_id').where({guest_id: user_id});
        if(existingRestrictedLinkAccess.length) {
            const existingLink = await db('link').where({ id: existingRestrictedLinkAccess[0].link_id, label });
            if(existingLink.length) {
                return { status: 0, message: "Nu poti crea link cu acelasi label ca cel la care esti invitat." };
            }
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

        const restrictedLinkIds = await db('link_access').select('link_id').where({guest_id: user_id});
        const restrictedIds = restrictedLinkIds.map(link => link.link_id);

        const restrictedLinks: Record<string, unknown>[] = [];

        for(const id of restrictedIds) {
            const link = await db('link').where({ id }).first();
            const processedLink = {
                ...link,
                isInvited: true,
            }
            restrictedLinks.push(processedLink);
        }

        const rLinks = links.filter(link => link.access === 'restricted');
        const rIds = rLinks.map(link => link.id);

        let emailMapping: Record<number, string[]> = {};

        if (rIds.length > 0) {
            const emails = await db('link_access')
                .join('users', 'users.id', '=', 'link_access.guest_id')
                .whereIn('link_id', rIds)
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

        return { status: 1, data: [...enrichedLinks, ...restrictedLinks] };
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

        if (link.user_id === user_id) {
            return { status: 1, data: link.url };
        }

        if (link.access === 'private' && link.user_id !== user_id) {
            return { status: 0, message: "Acces restrictionat" };
        }

        if (link.access === 'restricted') {
            const hasAccess = await db('link_access')
                .join('users', 'users.id', '=', 'link_access.guest_id')
                .where({ link_id: link.id })
                .andWhere('users.email', user_email)
                .first();

            if (!hasAccess) {
                return { status: 0, message: "Acces restrictionat" };
            }
        }

        return { status: 1, data: link.url };
    } catch (error) {
        logger.error(error);
        return { status: 0, message: "Eroare server" };
    }
};