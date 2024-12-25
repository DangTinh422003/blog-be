import express from 'express';

import AccessController from '@/controllers/access.controller';
import { asyncHandler } from '@/middlewares/asyncHandler';
import { isAuthenticated } from '@/middlewares/isAuthenticated';
import AccessValidation from '@/validations/access.validation';

const accessController = new AccessController();
const accessValidation = new AccessValidation();

const router = express.Router();

router.post(
  '/sign-up',
  asyncHandler(accessValidation.signUp),
  asyncHandler(accessController.signUp),
);
router.post(
  '/verify-otp',
  asyncHandler(accessValidation.verifySignUpToken),
  asyncHandler(accessController.verifySignUpToken),
);
router.post(
  '/sign-in',
  asyncHandler(accessValidation.signIn),
  asyncHandler(accessController.signIn),
);
router.post(
  '/sign-out',
  isAuthenticated,
  asyncHandler(accessValidation.signOut),
  asyncHandler(accessController.signOut),
);
router.post(
  '/refresh-token',
  asyncHandler(accessValidation.refressToken),
  asyncHandler(accessController.refressToken),
);
router.post(
  '/reset-password',
  asyncHandler(accessValidation.resetPassword),
  asyncHandler(accessController.resetPassword),
);
router.post(
  '/verify-reset-password',
  asyncHandler(accessValidation.verifySignUpToken),
  asyncHandler(accessController.verifyResetPassword),
);
router.post(
  '/change-password',
  isAuthenticated,
  asyncHandler(accessValidation.changePassword),
  asyncHandler(accessController.changePassword),
);

export default router;
