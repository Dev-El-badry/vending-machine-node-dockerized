import { body } from 'express-validator';

export const depositValidation = [
  body('amount')
    .notEmpty()
    .withMessage('qty not be empty')
    .isNumeric()
    .withMessage('must be a number')
    .isIn([5, 10, 20, 50, 100])
    .withMessage('banknote must be 5 OR 10 OR 20 OR 50 OR 100'),
];
