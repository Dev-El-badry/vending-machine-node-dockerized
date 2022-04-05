import { body } from 'express-validator';
import { Line } from '../models/line.model';

export const linesValidation = [
  body('title')
    .notEmpty()
    .withMessage('title not be empty')
    .isLength({ min: 1, max: 50 })
    .withMessage(
      'title must be above than 1 characters and below than 50 characters'
    )
    .custom((val, { req }) => {
      let customValidation: { [key: string]: any } = {};
      const id = req.params?.id;
      if (id) {
        customValidation['id'] = id;
      }
      return Line.findOne({
        title: val,
        ...customValidation,
      })
        .then((record) => {
          if (record) {
            return Promise.reject('line title is already exists');
          }
        })
        .catch((err) => {
          return Promise.reject('line title is already exists');
        });
    }),
];
