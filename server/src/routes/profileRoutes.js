import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Profile is private

router.get('/', getProfile);
router.put('/', updateProfile);

export default router;
