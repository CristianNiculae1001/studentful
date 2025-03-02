import express from 'express';
import { login, forgotPassword, changePasswordController, deleteAccountController, updateAccountInfoController } from '../../controllers/auth/login';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.post('/login', login);
router.post('/request-password-change', forgotPassword);
router.post('/change-password', changePasswordController);
router.put('/update-account-info', auth, updateAccountInfoController);
router.delete('/delete-account', auth, deleteAccountController);

export default router;