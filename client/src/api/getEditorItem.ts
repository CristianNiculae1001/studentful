import { EDITOR_URL } from "../utils/urls";

export const getEditorItem = async (id: string) => {
    const response = await fetch(`${EDITOR_URL}/${id}`, {
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth") || ""}`,
        },
    });
    const data = await response.json();  
    return data;
};