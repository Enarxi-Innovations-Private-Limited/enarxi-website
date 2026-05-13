import express from 'express';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';
import { getVisitorStats } from '../controllers/statsController.js';

const router = express.Router();

/**
 * @route   GET /api/stats
 * @desc    Get visitor statistics (total and daily)
 * @access  Private (Admin)
 */
router.get('/', authenticateUser, requireAdmin, getVisitorStats);

export default router;
