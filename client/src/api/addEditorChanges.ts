import { EDITOR_URL } from "../utils/urls";

export const addEditorChanges = async (data: any) => {
  try {
    const response = await fetch(EDITOR_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth") || ""}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    return responseData;
  } catch (err) {
    return { status: 0, message: "Server Error" };
  }
};