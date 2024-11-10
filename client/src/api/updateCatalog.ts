import { CATALOG_URL } from "../utils/urls";

export const updateCatalog = async (auth: string, updatedCatalogData: Record<string, {sem1: {credite: number; id: string; name: string; note: number[]}[]; sem2: {credite: number; id: string; name: string; note: number[]}[];}>[]) => {
    const response = await fetch(CATALOG_URL, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + auth,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCatalogData),
    });
    const data = await response.json();
    return data;
};