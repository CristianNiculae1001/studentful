import { CATALOG_URL } from "../utils/urls";

export const addCatalog = async (auth: string, catalogData: Record<string, unknown>) => {
    const response = await fetch(CATALOG_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + auth,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(catalogData),
    });
    const data = await response.json();
    return data;
};