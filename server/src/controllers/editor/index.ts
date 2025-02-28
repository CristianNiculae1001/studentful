import { Request, Response } from "express";
import { 
    addEditorChanges,
    getEditorChanges,
    getEditorsChanges,
    deleteEditorChanges,
    updateEditorChanges,
} from "../../services/editor";

export const addEditorChangesController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const editorData = req?.body;
    const addedEditor = await addEditorChanges(user_id, editorData);
    res.json(addedEditor);
};

export const getEditorsChangesController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const editor = await getEditorsChanges(user_id);
    res.json(editor);
};

export const getEditorChangesController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const id = req?.params?.id as string;
    const editor = await getEditorChanges(user_id, id);
    res.json(editor);
};

export const updateEditorChangesController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const id = req?.params?.id as string;
    const editorData = req?.body;
    const updatedEditor = await updateEditorChanges(user_id, id, editorData);
    res.json(updatedEditor);
};

export const deleteEditorChangesController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const id = req?.params?.id as string;
    const deletedEditor = await deleteEditorChanges(user_id, id);
    res.json(deletedEditor);
};
