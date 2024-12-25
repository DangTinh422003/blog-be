import express from 'express';

import AccessController from '@/controllers/access.controller';
import { asyncHandler } from '@/middlewares/asyncHandler';
import { isAuthenticated } from '@/middlewares/isAuthenticated';

const accessController = new AccessController();

const router = express.Router();

router.post('/sign-up', asyncHandler(accessController.signUp));
router.post('/verify-otp', asyncHandler(accessController.verifySignUpToken));
router.post('/sign-in', asyncHandler(accessController.signIn));
router.post('/sign-out', isAuthenticated, asyncHandler(accessController.signOut));
router.post('/refresh-token', asyncHandler(accessController.refressToken));
router.post('/reset-password', asyncHandler(accessController.resetPassword));
router.post('/verify-reset-password', asyncHandler(accessController.verifyResetPassword));
router.post('/change-password', isAuthenticated, asyncHandler(accessController.changePassword));

export default router;
