export const updateAccountInfo = async (payload: {
  firstName: string;
  lastName: string;
}) => {
  const UPDATE_ACCOUNT_INFO_URL =
    "http://localhost:5001/api/v1/update-account-info";
  const response = await fetch(UPDATE_ACCOUNT_INFO_URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("auth")}`,
    },
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return data;
};
