import { NOTES_URL } from "../utils/urls";

export const updateNoteItem = async (auth: string, id: number, status: boolean) => {
  const response = await fetch(`${NOTES_URL}/item/${id}`, {
        method: "PUT",
        headers: {
            Authorization: 'Bearer ' + auth,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        throw new Error("Failed to delete note item");
    }
    return response.json();
};