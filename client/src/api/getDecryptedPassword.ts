import { CREDENTIALS_URL } from "../utils/urls";

export const getDecryptedPassword = async (id: string) => {
    const response = await fetch(`${CREDENTIALS_URL}/password/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth')}`
        }
    });
    const data = await response.json();
    return data;
};