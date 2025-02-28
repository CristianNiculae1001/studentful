import { CREDENTIALS_URL } from "../utils/urls";

export const updateCredentials = async (id: string, credentials: any) => {
    const response = await fetch(`${CREDENTIALS_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth')}`
        },
        body: JSON.stringify(credentials)
    });
    const data = await response.json();
    return data;
};