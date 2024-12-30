import express from 'express';
import { getNotesController, addNoteController, addNoteItemController, getNoteItemsByNoteIdController, deleteNoteItemController } from '../../controllers/notes';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.get('/notes', auth, getNotesController);
router.post('/notes', auth, addNoteController);
router.post('/notes/item', auth, addNoteItemController);
router.get('/notes/items', auth, getNoteItemsByNoteIdController);
router.delete('/notes/item/:id', auth, deleteNoteItemController);

export default router;