import { body } from 'express-validator';
import { Product } from '../../products/models/product.model';

export const orderValidation = [
  body('qty')
    .notEmpty()
    .withMessage('qty not be empty')
    .isInt({ min: 1 })
    .withMessage('must be a number')
    .custom((val, { req }) => {
      const { product } = req.body;
      return Product.findOne({ _id: product, qty: { $gte: val } })
        .then((record) => {
          if (!record) {
            return Promise.reject('product quantity is not enough');
          }
        })
        .catch((err) => {
          return Promise.reject('product quantity is not enough');
        });
    }),

  body('product')
    .notEmpty()
    .withMessage('product not be empty')
    .isMongoId()
    .withMessage('invalid id')
    .custom((val) => {
      return Product.findById(val)
        .then((record) => {
          if (!record) {
            return Promise.reject('product not found');
          }
        })
        .catch((err) => {
          return Promise.reject('product not found');
        });
    }),
];
