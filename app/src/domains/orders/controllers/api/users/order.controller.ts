import { Request, Response } from 'express';
import { AppError } from '../../../../../../engine/errors/app-error';
import { NotFoundError } from '../../../../../../engine/errors/not-found-err';
import { Product } from '../../../../products/models/product.model';
import { User, UserDoc } from '../../../../users/models/user.models';
import { Order } from '../../../models/order.model';

export const createOrder = async (req: any, res: Response) => {
  const { product, qty } = req.body;

  const user = req.user as UserDoc;

  const productDoc = await Product.findById(product).select('cost');
  if (!productDoc) throw new NotFoundError();

  const total = +productDoc.cost * +qty;
  if (user.deposit < total) {
    throw new AppError('your deposit is not enough', 422);
  }

  const newDoc = await Order.create({ ...req.body, amount: total });

  const change = user.deposit - total;
  await User.findById(user.id).update({ deposit: change });

  res.status(201).json({
    status: 'success',
    data: {
      data: newDoc,
      change,
      total,
    },
  });
};
