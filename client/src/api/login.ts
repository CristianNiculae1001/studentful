import { LOGIN_URL } from "../utils/urls";
import type { LoginPayload } from "../types/login.type";

export const login = async (payload: LoginPayload) => {
    const response = await fetch(LOGIN_URL, {
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