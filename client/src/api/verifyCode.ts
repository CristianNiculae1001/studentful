export const verifyCode = async (email: string, code: string) => {
  const VERIFY_CODE_URL = "http://localhost:5001/api/v1/verify";
  const payload = {
    email,
    token: code,
  };
  const response = await fetch(VERIFY_CODE_URL, {
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
