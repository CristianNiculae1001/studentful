import express from 'express';
import { login, forgotPassword } from '../../controllers/auth/login';

const router = express.Router();

router.post('/login', login);
router.post('/password-change', forgotPassword);

export default router;