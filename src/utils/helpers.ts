import { Types } from 'mongoose';

/**
 * Check if string is a valid mongoose ObjectId type
 * @param {string} str 
 * @returns {boolean}
 */
export const isValidObjectId = (str: string): boolean => {
    return Types.ObjectId.isValid(str);
}

/**
 * Make string a valid mongoose ObjectId type
 * @param {string|Types.ObjectId} str 
 * @returns {Types.ObjectId}
 */
export const makeValidObjectId = (str: string | Types.ObjectId): Types.ObjectId => {
    return new Types.ObjectId(str);
}