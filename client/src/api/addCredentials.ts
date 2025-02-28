import { CREDENTIALS_URL } from "../utils/urls";

export const addCredentials = async (service: string, username: string, password: string) => {
    const response = await fetch(CREDENTIALS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth')}`
        },
        body: JSON.stringify({ service, username, password })
    });
    const data = await response.json();
    return data;  
};