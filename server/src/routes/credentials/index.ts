import express from 'express';
import { getCredentialsController, addCredentialsController, getDecryptedPasswordController, deleteCredentialsController, updateCredentialsController } from '../../controllers/credentials';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.get('/credentials', auth, getCredentialsController);
router.post('/credentials', auth, addCredentialsController);
router.get('/credentials/password/:id', auth, getDecryptedPasswordController);
router.put('/credentials/:id', auth, updateCredentialsController);
router.delete('/credentials/:id', auth, deleteCredentialsController);

export default router;