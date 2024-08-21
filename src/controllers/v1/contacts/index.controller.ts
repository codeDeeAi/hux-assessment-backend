import { Request, Response } from "express";
import { validate } from "../../../utils/validator";
import { makeValidObjectId } from "../../../utils/helpers";
import ApiResponse from "../../../libs/support/apiResponse";
import ContactService from "../../../services/v1/contact/contact.service";
import { createValidation, idValidation, updateValidation } from "./validations/contact.validation";


/**
 * List all contacts
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
export const index = [validate([]), async (req: Request, res: Response) => {

    try {

        const contacts = await new ContactService().List();

        return ApiResponse.success(res, 'Contacts fetched', contacts);

    } catch (error: any) {

        return ApiResponse.serverError(res, "Error fetching contacts", error.message || JSON.stringify(error));
    }
}];

/**
 * Create a new contact
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
export const create = [validate(createValidation), async (req: Request, res: Response) => {

    try {
        const { first_name, last_name, phone_number } = req.body;

        const contact = await new ContactService().Create({
            first_name,
            last_name,
            phone_number
        });

        return ApiResponse.created(res, 'Contact added', contact);

    } catch (error: any) {

        return ApiResponse.serverError(res, "Error adding contact", error.message || JSON.stringify(error));
    }
}];


/**
 * Show an existing contact
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
export const show = [validate(idValidation), async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const response = await new ContactService().Show(makeValidObjectId(id));

        if (response == null)
            return ApiResponse.notFound(res, 'Contact not found', 'Contact not found');

        return ApiResponse.success(res, 'Data fetched', response);

    } catch (error: any) {

        return ApiResponse.serverError(res, "Error fetching contact", error.message || JSON.stringify(error));
    }
}];

/**
 * Update an existing contact
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
export const update = [validate(updateValidation), async (req: Request, res: Response) => {

    try {
        const { first_name, last_name, phone_number } = req.body;

        const { id } = req.params;

        const contact = await new ContactService().Update({
            id: makeValidObjectId(id),
            ...(first_name) && { first_name },
            ...(last_name) && { last_name },
            ...(phone_number) && { phone_number }
        });

        return ApiResponse.success(res, 'Contact updated', contact);

    } catch (error: any) {

        return ApiResponse.serverError(res, "Error updating contact", error.message || JSON.stringify(error));
    }
}];

/**
 * Delete an existing contact
 * @param {Request} req
 * @param {Response} res
 * @return {Response}
 */
export const destroy = [validate(idValidation), async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const response = await new ContactService().Delete(makeValidObjectId(id));

        if (!response) throw new Error("Error deleting contact");

        return ApiResponse.success(res, 'Contact deleted');

    } catch (error: any) {

        return ApiResponse.serverError(res, "Error deleting contact", error.message || JSON.stringify(error));
    }
}];