import express from 'express';
import { addCatalog, getCatalog, updateCatalog } from '../../controllers/catalog';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.get('/catalog', auth, getCatalog);
router.post('/catalog', auth, addCatalog);
router.put('/catalog', auth, updateCatalog);

export default router;