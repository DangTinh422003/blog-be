import express from 'express';

import AccessController from '@/controllers/access.controller';
import { handleError } from '@/middlewares/handleError';
import { isAuthenticated } from '@/middlewares/isAuthenticated';
import AccessValidation from '@/validations/access.validation';

const accessController = new AccessController();
const accessValidation = new AccessValidation();

const router = express.Router();

router.post(
  '/sign-up',
  handleError(accessValidation.signUp),
  handleError(accessController.signUp),
);
router.post(
  '/verify-otp',
  handleError(accessValidation.verifySignUpToken),
  handleError(accessController.verifySignUpToken),
);
router.post(
  '/sign-in',
  handleError(accessValidation.signIn),
  handleError(accessController.signIn),
);
router.post(
  '/sign-out',
  isAuthenticated,
  handleError(accessValidation.signOut),
  handleError(accessController.signOut),
);
router.post(
  '/refresh-token',
  handleError(accessValidation.refressToken),
  handleError(accessController.refressToken),
);
router.post(
  '/reset-password',
  handleError(accessValidation.resetPassword),
  handleError(accessController.resetPassword),
);
router.post(
  '/verify-reset-password',
  handleError(accessValidation.verifySignUpToken),
  handleError(accessController.verifyResetPassword),
);
router.post(
  '/change-password',
  isAuthenticated,
  handleError(accessValidation.changePassword),
  handleError(accessController.changePassword),
);

export default router;
