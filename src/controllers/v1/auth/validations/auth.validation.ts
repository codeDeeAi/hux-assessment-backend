import { body, param } from "express-validator";
import User from "../../../../models/User.model";
import { makeValidObjectId } from "../../../../utils/helpers";


export const registerValidation: any[] = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name should be a valid string')
        .isLength({ min: 3, max: 100 }),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email should be a valid email format')
        .custom(async (value) => {
            const query = await User.findOne({ email: value });

            if (query)
                return Promise.reject('Email is taken');

            return true;
        }),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isString()
        .withMessage('Password should be a valid string')
        .isLength({ min: 6, max: 20 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/\d/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'),
];

export const loginValidation: any[] = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email should be a valid email format'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isString()
        .withMessage('Password should be a valid string')
];