import { NOTES_URL } from "../utils/urls";

export const getNoteItemsByNoteId = async (auth: string, noteId: number) => {
  const response = await fetch(`${NOTES_URL}/items?id=${noteId}`, {
        headers: {
        Authorization: 'Bearer ' + auth,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch note items");
    }
    return response.json();
};