import express from 'express';
import { getNotesController, addNoteController } from '../../controllers/notes';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.get('/notes', auth, getNotesController);
router.post('/notes', auth, addNoteController);

export default router;