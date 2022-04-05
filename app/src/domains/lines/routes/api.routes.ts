import express from 'express';
import { protect } from '../../../../engine/middlewares/protect';
import { restrictTo } from '../../../../engine/middlewares/restrict-to';
import { validateRequest } from '../../../../engine/middlewares/validate-request';
import {
  createLine,
  deleteLine,
  getLine,
  getLines,
  updateLine,
} from '../controllers/api/lines/lines.controller';
import { linesValidation } from '../validations/lines.validation';

const router = express.Router();
//////////
//lines
//////////

router.route('/').get(getLines);
router.route('/:id').get(getLine);

router.use(protect, restrictTo('admin', 'seller'));
router.post('/', linesValidation, validateRequest, createLine);
router
  .route('/:id')
  .put(linesValidation, validateRequest, updateLine)
  .delete(deleteLine);

export { router as lineApiRouter };
