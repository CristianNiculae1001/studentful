import { NOTES_URL } from "../utils/urls";

export const addNote = async (note: {title: string; tag?: string}, token: string) => {
  const response = await fetch(NOTES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    throw new Error("Failed to add note");
  }

  return response.json();
};