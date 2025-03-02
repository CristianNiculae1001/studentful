export const register = async (userPayload: Record<string, unknown>) => {
    const REGISTER_URL = 'http://localhost:5000/api/v1/register';
    const response = await fetch(REGISTER_URL, {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(userPayload),
    });
    const data = await response.json();
    return data;
};