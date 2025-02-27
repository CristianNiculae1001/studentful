import { EDITOR_URL } from "../utils/urls";

export const deleteEditorItem = async (id: string) => {
    try {
        const response = await fetch(`${EDITOR_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("auth") || ""}`,
            },
        });

        const responseData = await response.json();

        return responseData;
    } catch (err) {
        return { status: 0, message: "Server Error" };
    }
};