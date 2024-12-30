import { NOTES_URL } from "../utils/urls";

export const addNoteItem = async (auth: string, payload: {id: number; description: string;}) => {
  const response = await fetch(`${NOTES_URL}/item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
       Authorization: 'Bearer ' + auth,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to add note item");
  }

  return response.json();
};