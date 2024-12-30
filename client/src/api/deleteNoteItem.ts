import { NOTES_URL } from "../utils/urls";

export const deleteNoteItem = async (auth: string, id: number) => {
  const response = await fetch(`${NOTES_URL}/item/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: 'Bearer ' + auth,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to delete note item");
    }
    return response.json();
};