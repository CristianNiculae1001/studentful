import { Request, Response } from "express";
import { 
    addCredentials,
    getCredentials,
    getDecryptedPassword,
    deleteCredentials,
    updateCredentials,
} from "../../services/credentials";

export const addCredentialsController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const credentialsData = req?.body;
    const addedCredentials = await addCredentials(user_id, credentialsData?.service, credentialsData?.username, credentialsData?.password);
    res.json(addedCredentials);
};

export const getCredentialsController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const credentials = await getCredentials(user_id);
    res.json(credentials);
};

export const getDecryptedPasswordController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const id = req?.params?.id as string;
    const password = await getDecryptedPassword(user_id, id);
    res.json(password);
};

export const updateCredentialsController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const id = req?.params?.id as string;
    const credentialsData = req?.body;
    const updatedCredentials = await updateCredentials(user_id, id, credentialsData?.service, credentialsData?.username, credentialsData?.password);
    res.json(updatedCredentials);
};

export const deleteCredentialsController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const id = req?.params?.id as string;
    const deletedCredentials = await deleteCredentials(user_id, id);
    res.json(deletedCredentials);
};
