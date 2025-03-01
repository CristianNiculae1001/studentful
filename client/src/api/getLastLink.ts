import { HOMEPAGE_URL } from "../utils/urls";

export const getLastLink = async () => {
  const response = await fetch(`${HOMEPAGE_URL}/last-link`, {
    headers: {
      "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth")}`,
    },
  });
  const data = await response.json();
  return data;
};