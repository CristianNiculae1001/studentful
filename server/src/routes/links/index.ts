import express from 'express';
import { 
    getAllLinksController, 
    createLinkController, 
    updateLinkController, 
    deleteLinkController, 
    redirectLinkController 
} from '../../controllers/links';
import { auth } from '../../middlewares/auth';
import { verifyUrlAccess } from '../../middlewares/verifyUrlAccess';

const router = express.Router();

router.get('/links', auth, getAllLinksController);
router.post('/links', auth, createLinkController);
router.put('/links/:id', auth, updateLinkController);
router.delete('/links/:id', auth, deleteLinkController);
router.post('/links/:label', verifyUrlAccess, auth, redirectLinkController);

export default router;
