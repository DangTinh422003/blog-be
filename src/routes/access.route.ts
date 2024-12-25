import express from 'express';

import AccessController from '@/controllers/access.controller';
import { isAuthenticated } from '@/middlewares/isAuthenticated';
import AccessValidation from '@/validations/access.validation';

const accessController = new AccessController();
const accessValidation = new AccessValidation();

const router = express.Router();

router.post('/sign-up', accessValidation.signUp, accessController.signUp);
router.post(
  '/verify-otp',
  accessValidation.verifySignUpToken,
  accessController.verifySignUpToken,
);
router.post('/sign-in', accessValidation.signIn, accessController.signIn);
router.post(
  '/sign-out',
  isAuthenticated,
  accessValidation.signOut,
  accessController.signOut,
);
router.post(
  '/refresh-token',
  accessValidation.refressToken,
  accessController.refressToken,
);
router.post(
  '/reset-password',
  accessValidation.resetPassword,
  accessController.resetPassword,
);
router.post(
  '/verify-reset-password',
  accessValidation.verifySignUpToken,
  accessController.verifyResetPassword,
);
router.post(
  '/change-password',
  isAuthenticated,
  accessValidation.changePassword,
  accessController.changePassword,
);

export default router;
