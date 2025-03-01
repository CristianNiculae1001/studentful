import express from 'express';
import { 
    getLastLinkController,
    getLastNoteController,
    getCatalogStatsController
} from '../../controllers/homepage';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.get('/homepage/last-note', auth, getLastNoteController);
router.get('/homepage/last-link', auth, getLastLinkController);
router.get('/homepage/catalog-stats', auth, getCatalogStatsController);

export default router;
