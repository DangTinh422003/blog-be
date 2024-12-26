import express from 'express';

import AccessController from '@/controllers/access.controller';
import { asyncHandler } from '@/middlewares/asyncHandler';
import { isAuthenticated } from '@/middlewares/isAuthenticated';
import { validationRequest } from '@/middlewares/validationRequest';
import accessValidation from '@/validations/access.validation';

const accessController = new AccessController();

const router = express.Router();

router.post(
  '/sign-up',
  validationRequest({ ...accessValidation.signUpSchema }),
  asyncHandler(accessController.signUp),
);

router.post(
  '/verify-otp',
  validationRequest({ ...accessValidation.verifySignUpTokenSchema }),
  asyncHandler(accessController.verifySignUpToken),
);

router.post(
  '/sign-in',
  validationRequest({ ...accessValidation.signInSchema }),
  asyncHandler(accessController.signIn),
);

router.post(
  '/sign-out',
  validationRequest({ ...accessValidation.signOutSchema }),
  isAuthenticated,
  asyncHandler(accessController.signOut),
);

router.post(
  '/refresh-token',
  validationRequest({ ...accessValidation.refressTokenSchema }),
  asyncHandler(accessController.refressToken),
);

router.post(
  '/reset-password',
  validationRequest({ ...accessValidation.resetPasswordSchema }),
  asyncHandler(accessController.resetPassword),
);

router.post(
  '/verify-reset-password',
  validationRequest({ ...accessValidation.verifySignUpTokenSchema }),
  asyncHandler(accessController.verifyResetPassword),
);

router.post(
  '/change-password',
  validationRequest({ ...accessValidation.changePasswordSchema }),
  isAuthenticated,
  asyncHandler(accessController.changePassword),
);

export default router;
