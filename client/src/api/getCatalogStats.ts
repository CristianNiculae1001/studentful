import { HOMEPAGE_URL } from "../utils/urls";

export const getCatalogStats = async () => {
    const response = await fetch(`${HOMEPAGE_URL}/catalog-stats`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
    });
    const data = await response.json();
    return data;
};