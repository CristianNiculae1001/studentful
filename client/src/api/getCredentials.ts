import { CREDENTIALS_URL } from "../utils/urls";

export const getCredentials = async () => {
    const response = await fetch(CREDENTIALS_URL, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth')}`
        }
    });
    const data = await response.json();
    return data;
};
