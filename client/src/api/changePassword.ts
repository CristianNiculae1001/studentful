export const changePassword = async (payload: {
  password: string;
  id: string;
}) => {
  const CHANGE_PASSWORD_URL = "http://localhost:5001/api/v1/change-password";
  const response = await fetch(CHANGE_PASSWORD_URL, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return data;
};
