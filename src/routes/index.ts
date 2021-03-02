import { Router } from 'express';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

// Export the base-router
export default router;
