import { NOTES_URL } from "../utils/urls";

export const deleteNote = async (id: string) => {
  try {
    const response = await fetch(`${NOTES_URL}/${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('auth')}`
      }
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error("Failed to delete note");
  } catch (error) {
    console.error("Failed to delete note", error);
    throw error;
  }
};