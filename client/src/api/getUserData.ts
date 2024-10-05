import { GET_USER_URL } from "../utils/urls";

export const getUserData = async () => {
    const response = await fetch(GET_USER_URL);
    const data = await response.json();
    return data;
};