import express from 'express';
import { protect } from '../../../../engine/middlewares/protect';
import { restrictTo } from '../../../../engine/middlewares/restrict-to';
import { validateRequest } from '../../../../engine/middlewares/validate-request';
import {
  deposit,
  getMe,
  getUser,
  reset,
} from '../controllers/api/users.controller';
import { depositValidation } from '../validations/deposit.validation';
import { authRouter } from './auth.routes';

const router = express.Router();

router.use('/auth', authRouter);
router.use(protect); //middleware to get current user and for authenticate user
router.get('/me', getMe, getUser);

router.use(restrictTo('buyer'));
router.post('/deposit', depositValidation, validateRequest, deposit);
router.get('/reset', reset);
export { router as userApiRouter };
