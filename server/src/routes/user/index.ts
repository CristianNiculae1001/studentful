import express from 'express';
import { getUser } from '../../controllers/user';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.get('/user', auth, getUser);

export default router;