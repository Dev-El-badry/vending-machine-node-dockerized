import express from 'express';
import { protect } from '../../../../engine/middlewares/protect';
import { restrictTo } from '../../../../engine/middlewares/restrict-to';
import { validateRequest } from '../../../../engine/middlewares/validate-request';
import { createOrder } from '../controllers/api/users/order.controller';
import { orderValidation } from '../validations/order.validation';

const router = express.Router();

router.use(protect, restrictTo('buyer'));
router.route('/buy').post(orderValidation, validateRequest, createOrder);

export { router as orderApiRouter };
