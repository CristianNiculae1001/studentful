import { useEffect, useState } from "react"
import { getUserData } from "../api/getUserData";
import { updateUserData } from "../features/user";
import { useDispatch } from "react-redux";
import { useToast } from "@chakra-ui/react";

function useAuth() {
    
    const toast = useToast();
    const dispatch = useDispatch();
    const [user, setUser] = useState<Record<string, string> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const getUserDataHandler = async () => {
        const auth = sessionStorage.getItem('auth') ?? '';
        setIsLoading(true);
        const userData = await getUserData(auth);
        if(userData?.status === 0) {
            setIsLoading(false);
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
        dispatch(updateUserData(userData?.data[0]));
        setUser(userData?.data[0]);
        setIsLoading(false);
    };

    useEffect(() => {
        getUserDataHandler();
    }, []);

    return {user, setUser, isLoading};
}

export default useAuth