import { body } from 'express-validator';
import { User } from '../models/user.models';

export const signUpValidation = [
  body('username')
    .notEmpty()
    .withMessage('username not be empty')
    .isLength({ min: 3, max: 120 })
    .withMessage(
      'username must be above than 3 characters and below than 120 characters'
    )
    .custom((val) => {
      return User.findOne({
        username: val,
      })
        .then((record) => {
          if (record) {
            return Promise.reject('username is already exists');
          }
        })
        .catch((err) => {
          return Promise.reject('username is already exists');
        });
    }),

  body('password')
    .notEmpty()
    .withMessage('password not be empty')
    .isLength({ min: 6, max: 120 })
    .withMessage(
      'password must be above than 6 characters and below than 120 characters'
    ),

  body('confirmPassword')
    .notEmpty()
    .withMessage('please confirm your password')
    .custom((val: string, { req }) => {
      if (val !== req.body.password) {
        return Promise.reject('Passwords are not the same');
      }

      return true;
    }),
];
