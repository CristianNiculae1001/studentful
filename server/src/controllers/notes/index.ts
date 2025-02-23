import { Request, Response } from "express";
import { addNote, getNotes, getNoteItemsByNoteId, addNoteItem, deleteNoteItem, deleteNote, updateNoteItemStatus } from "../../services/notes";

export const addNoteController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const noteData = req?.body;
    const addedCatalogData = await addNote({user_id, ...noteData});
    res.json(addedCatalogData);
};

export const getNotesController = async (req: Request, res: Response) => {
    //@ts-ignore
    const user_id = req?.token?.id;
    const page = req?.query?.page;
    const limit = req?.query?.limit;
    const search = req?.query?.search;
    //@ts-ignore
    const catalog = await getNotes(user_id, page, limit, search);
    res.json(catalog);
};

export const deleteNoteController = async (req: Request, res: Response) => {
    const noteId = req?.params?.id as string
    const deletedNote = await deleteNote(parseInt(noteId));
    res.json(deletedNote);
};

export const addNoteItemController = async (req: Request, res: Response) => {
    const note_id = req?.body?.id;
    const description = req?.body?.description;
    const noteItem = await addNoteItem(note_id, description);
    res.json(noteItem);
};

export const getNoteItemsByNoteIdController = async (req: Request, res: Response) => {
    const note_id = req?.query?.id as string;
    let noteItems: Record<string, unknown>[] = [];
    if(note_id) {
        noteItems = (await getNoteItemsByNoteId(parseInt(note_id))).data ?? [];
    } else {
        noteItems = [];
    }
    res.json(noteItems);
};

export const deleteNoteItemController = async (req: Request, res: Response) => {
    const noteItemId = req?.params?.id as string
    const deletedNoteItem = await deleteNoteItem(parseInt(noteItemId));
    res.json(deletedNoteItem);
};

export const updateNoteItemStatusController = async (req: Request, res: Response) => {
    const noteItemId = req?.params?.id as string
    const status = req?.body?.status as string
    const updatedNoteItem = await updateNoteItemStatus(parseInt(noteItemId), Boolean(status));
    res.json(updatedNoteItem);
};