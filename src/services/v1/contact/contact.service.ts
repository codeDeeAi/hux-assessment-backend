import { Types } from "mongoose";
import Contact, { IContact } from "../../../models/Contact.model";

export interface ICreate {
    first_name: string;
    last_name: string;
    phone_number: string;
}

export interface IUpdate {
    id: Types.ObjectId;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
}

/**
 * Service class for managing contacts.
 * @class ContactService
 * @author Adeola Bada
 */
export default class ContactService {

    constructor() {
        //
    }


    /**
     * Retrieves a list of all contacts.
     * @returns {Promise<IContact[]>} A promise that resolves to an array of contacts.
     * @throws {Error} If an error occurs during the retrieval.
     */
    public async List(): Promise<IContact[]> {
        try {

            const contacts = await Contact.find();

            return contacts as IContact[];

        } catch (error: any) {

            throw new Error(error?.message || JSON.stringify(error));
        }
    }


    /**
    * Retrieves a contact by its ID.
    * @param {Types.ObjectId} id - The ID of the contact to retrieve.
    * @returns {Promise<IContact | null>} A promise that resolves to the contact if found, otherwise null.
    * @throws {Error} If an error occurs during the retrieval.
    */
    public async Show(id: Types.ObjectId): Promise<IContact | null> {
        try {

            const contact = await Contact.find({ _id: id });

            if (!contact) return null;

            return contact as unknown as IContact;

        } catch (error: any) {

            throw new Error(error?.message || JSON.stringify(error));
        }
    }


    /**
     * Creates a new contact.
     * @param {ICreate} options - The data required to create the contact.
     * @returns {Promise<IContact>} A promise that resolves to the newly created contact.
     * @throws {Error} If an error occurs during creation.
     */
    public async Create(options: ICreate): Promise<IContact> {
        try {

            const contact = await new Contact(options).save();

            if (!contact) throw new Error("Error creating contact");

            return contact as IContact;

        } catch (error: any) {
            throw new Error(error?.message || JSON.stringify(error));
        }
    }

    /**
    * Updates an existing contact.
    * @param {IUpdate} options - The data required to update the contact.
    * @returns {Promise<IContact>} A promise that resolves to the updated contact.
    * @throws {Error} If an error occurs during the update.
    */
    public async Update(options: IUpdate): Promise<IContact> {
        try {

            const { id, first_name, last_name, phone_number } = options;

            const contact = await Contact.findOneAndUpdate({ _id: id }, {
                ...(first_name) && { first_name },
                ...(last_name) && { last_name },
                ...(phone_number) && { phone_number },
            }, { new: true });

            if (!contact) throw new Error("Error updating contact");

            return contact as IContact;

        } catch (error: any) {
            throw new Error(error?.message || JSON.stringify(error));
        }
    }

    /**
     * Deletes a contact by its ID.
     * @param {Types.ObjectId} id - The ID of the contact to delete.
     * @returns {Promise<boolean>} A promise that resolves to true if the contact was successfully deleted, otherwise false.
     * @throws {Error} If an error occurs during deletion.
     */
    public async Delete(id: Types.ObjectId): Promise<boolean> {
        try {

            const deleted = await Contact.findOneAndDelete({ _id: id });

            return deleted !== null;

        } catch (error: any) {

            throw new Error(error?.message || JSON.stringify(error));
        }
    }
}