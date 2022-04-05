import express from 'express';
import { validateRequest } from '../../../../engine/middlewares/validate-request';
import { logout, signup, signin } from '../controllers/api/auth.controllers';
import { signUpValidation } from '../validations/signup.validation';

const router = express.Router();

router.post('/signup', signUpValidation, validateRequest, signup);
router.post('/signin', signin);
router.get('/logout', logout);

export { router as authRouter };
