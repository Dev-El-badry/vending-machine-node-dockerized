import { NextFunction, Request, Response } from 'express';
import {
  addOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from '../../../../../../engine/factories/handler.factories';
import { Product } from '../../../models/product.model';

export const fetchSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  req.body.seller = user.id;
  next();
};

export const getProducts = getAll(Product);
export const createProduct = addOne(Product);
export const updateProduct = updateOne(Product);
export const getProduct = getOne(Product);
export const deleteProduct = deleteOne(Product);
