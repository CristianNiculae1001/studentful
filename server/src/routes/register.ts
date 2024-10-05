import express from 'express';
import { verifyCode, register } from '../controllers/register';

const router = express.Router();

router.post('/register', register);
router.post('/verify', verifyCode);

export default router;