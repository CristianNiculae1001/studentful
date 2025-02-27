import express from 'express';
import { 
    addEditorChangesController,
    getEditorChangesController,
    getEditorsChangesController,
    deleteEditorChangesController,
    updateEditorChangesController,
} from '../../controllers/editor';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.post('/editor', auth, addEditorChangesController);
router.get('/editor', auth, getEditorsChangesController);
router.get('/editor/:id', auth, getEditorChangesController);
router.put('/editor/:id', auth, updateEditorChangesController);
router.delete('/editor/:id', auth, deleteEditorChangesController);

export default router;