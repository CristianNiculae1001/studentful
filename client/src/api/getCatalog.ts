import { CATALOG_URL } from "../utils/urls";

export const getCatalog = async (auth: string) => {
    const response = await fetch(CATALOG_URL, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + auth,
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
};