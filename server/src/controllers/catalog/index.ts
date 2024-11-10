import { Request, Response } from "express";
import { addCatalogData, getCatalogData, updateCatalogData } from "../../services/catalog";

export const addCatalog = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const catalog = req?.body;
    const addedCatalogData = await addCatalogData({user_id, catalog});
    res.json(addedCatalogData);
};

export const updateCatalog = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const catalog = req?.body;
    const updatedCatalogData = await updateCatalogData({user_id, catalog});
    res.json(updatedCatalogData);
};

export const getCatalog = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const catalog = await getCatalogData(user_id);
    res.json(catalog);
};