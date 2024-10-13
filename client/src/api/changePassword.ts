import { CHANGE_PASSWORD_URL } from "../utils/urls";

export const changePassword = async (payload: {email: string}) => {
    const response = await fetch(CHANGE_PASSWORD_URL, {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
};