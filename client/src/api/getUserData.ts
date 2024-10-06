import { GET_USER_URL } from "../utils/urls";

export const getUserData = async (auth: string) => {
    const response = await fetch(GET_USER_URL, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + auth,
        }
    });
    const data = await response.json();
    return data;
};