import { restrictTo } from './../../../../engine/middlewares/restrict-to';
import express from 'express';
import { validateRequest } from '../../../../engine/middlewares/validate-request';
import {
  createProduct,
  deleteProduct,
  fetchSeller,
  getProduct,
  getProducts,
  updateProduct,
} from '../controllers/api/products/products.controller';
import { productValidation } from '../validations/products.validation';
import { protect } from '../../../../engine/middlewares/protect';

const router = express.Router();

router.route('/').get(getProducts);
router.route('/:id').get(getProduct);

router.use(protect);
router.use(restrictTo('admin', 'seller'));
router.post(
  '/',
  productValidation,
  validateRequest,
  fetchSeller,
  createProduct
);
router
  .route('/:id')
  .put(productValidation, validateRequest, fetchSeller, updateProduct)
  .delete(deleteProduct);

export { router as productApiRouter };
