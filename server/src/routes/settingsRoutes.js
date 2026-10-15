import express from 'express';
import { changePassword, deleteAccount } from '../controllers/settingsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.put('/change-password', changePassword);
router.delete('/delete-account', deleteAccount);

export default router;
