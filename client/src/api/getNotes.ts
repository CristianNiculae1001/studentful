import { NOTES_URL } from "../utils/urls";

export const getNotes = async (token: string, page: number, limit: number, search?: string) => {
  const searchQuery = search ? `&search=${search}` : '';
  const response = await fetch(`${NOTES_URL}?page=${page}&limit=${limit}` + searchQuery, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }

  return response.json();
};