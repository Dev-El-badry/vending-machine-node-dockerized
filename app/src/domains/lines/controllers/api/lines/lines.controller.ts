import {
  addOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from '../../../../../../engine/factories/handler.factories';
import { Line } from '../../../models/line.model';

export const getLines = getAll(Line, '', { path: 'products' });
export const getLine = getOne(Line, { path: 'products' });
export const createLine = addOne(Line);
export const updateLine = updateOne(Line);
export const deleteLine = deleteOne(Line);
