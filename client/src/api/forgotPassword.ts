import { FORGOT_PASSWORD_URL } from "../utils/urls";

export const forgotPassword = async (payload: {email: string}) => {
    const response = await fetch(FORGOT_PASSWORD_URL, {
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