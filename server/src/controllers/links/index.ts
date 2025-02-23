import { Request, Response } from "express";
import { 
    getAllLinks, 
    createLink, 
    updateLink, 
    deleteLink, 
    redirectLink 
} from "../../services/links";

export const createLinkController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const linkData = req?.body;
    const addedLink = await createLink({ user_id, ...linkData });
    res.json(addedLink);
};

export const getAllLinksController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const links = await getAllLinks(user_id);
    res.json(links);
};

export const updateLinkController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const linkId = req?.params?.id as string;
    const linkData = req?.body;
    const updatedLink = await updateLink(parseInt(linkId), user_id, linkData);
    res.json(updatedLink);
};

export const deleteLinkController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const linkId = req?.params?.id as string;
    const deletedLink = await deleteLink(parseInt(linkId), user_id);
    res.json(deletedLink);
};

export const redirectLinkController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const { label } = req.params;

    if (!label) {
        return res.status(400).json({ status: 0, message: "Lipsește label-ul" });
    }

    const result = await redirectLink(label, user_id);

    if (result.status === 1) {
        return res.json(result);
    } else {
        return res.status(403).json(result);
    }
};