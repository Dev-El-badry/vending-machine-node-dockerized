import { body } from 'express-validator';
import { Line } from '../../lines/models/line.model';
import { User } from '../../users/models/user.models';
import { Product } from '../models/product.model';

export const productValidation = [
  body('title')
    .notEmpty()
    .withMessage('title not be empty')
    .isLength({ min: 3, max: 120 })
    .withMessage(
      'title must be above than  characters and below than 120 characters'
    )
    .trim()
    .custom((val, { req }) => {
      let customValidation: { [key: string]: any } = {};
      const id = req.params?.id;
      if (id) {
        customValidation['id'] = id;
      }
      return Product.findOne({
        title: val,
        ...customValidation,
      })
        .then((record) => {
          if (record) {
            return Promise.reject('product title is already exists');
          }
        })
        .catch((err) => {
          return Promise.reject('product title is already exists');
        });
    }),
  body('cost')
    .notEmpty()
    .withMessage('cost not be empty')
    .isInt({ min: 1 })
    .withMessage('cost must be number '),
  body('qty')
    .notEmpty()
    .withMessage('quantity not be empty')
    .isInt({ min: 1 })
    .withMessage('quantity must be number '),
  body('line')
    .notEmpty()
    .withMessage('line not be empty')
    .isMongoId()
    .withMessage('invalid id')
    .custom((val) => {
      return Line.findById(val)
        .then((record) => {
          if (!record) {
            return Promise.reject('line not found');
          }
        })
        .catch((err) => {
          return Promise.reject('line not found');
        });
    }),
];
