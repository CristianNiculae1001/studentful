import express from 'express';
import { addCatalog, getCatalog } from '../../controllers/catalog';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.get('/catalog', auth, getCatalog);
router.post('/catalog', auth, addCatalog);

export default router;