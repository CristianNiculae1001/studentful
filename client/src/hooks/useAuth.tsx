import { useEffect, useState } from "react"
import { getUserData } from "../api/getUserData";
import { updateUserData } from "../features/user";
import { useDispatch } from "react-redux";
import { useToast } from "@chakra-ui/react";

function useAuth() {
    
    const toast = useToast();
    const dispatch = useDispatch();
    const [user, setUser] = useState<Record<string, string> | null>(null);

    const getUserDataHandler = async () => {
        const userData = await getUserData();
        if(userData?.status === 0) {
            setUser(null);
            dispatch(updateUserData(null));
            toast({
                title: userData?.message,
                status: "error",
                isClosable: true,
                duration: 2000,
                position: "top-right",
              });
            return;
        }
        dispatch(updateUserData(userData?.data));
        setUser(userData?.data);
    };

    useEffect(() => {
        getUserDataHandler();
    }, []);

    return {user};
}

export default useAuth