import { HOMEPAGE_URL } from "../utils/urls";

export const getLastNote = async () => {
  const response = await fetch(`${HOMEPAGE_URL}/last-note`, {
    headers: {
      "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth")}`,
    },
  });
  const data = await response.json();
  return data;
};