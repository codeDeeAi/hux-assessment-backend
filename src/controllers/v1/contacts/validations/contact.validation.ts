import { body, param } from "express-validator";
import Contact from "../../../../models/Contact.model";
import { isValidObjectId } from "../../../../utils/helpers";

export const idValidation: any[] = [
    param('id')
        .notEmpty()
        .withMessage('ID is required')
        .custom(async (value) => {
            if (!isValidObjectId(value)) {
                return Promise.reject('ID should be a valid ID string');
            }

            const query = await Contact.findOne({
                _id: value,
            });

            if (!query) {
                return Promise.reject('Contact does not exist');
            }

            return true;
        })
];

export const createValidation: any[] = [
    body('first_name')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isString()
        .withMessage('First name should be a valid string')
        .isLength({ min: 3, max: 100 }),
    body('last_name')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isString()
        .withMessage('Last name should be a valid string')
        .isLength({ min: 3, max: 100 }),
    body('phone_number')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required')
        .isLength({ min: 11, max: 11 })
        .withMessage('Phone number length should be 11')
        .matches(/^(?:\+234|0)\d{10}$/)
];