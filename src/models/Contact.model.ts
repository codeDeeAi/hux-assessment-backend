import User from './User.model';
import mongoose, { Schema, Types, Document } from 'mongoose';

export interface IContact extends Document {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    first_name: string;
    last_name: string;
    phone_number: string;
    createdAt: Date | null;
    updatedAt: Date | null;
};

const ContactSchema = new Schema(
    {
        user_id: {
            type: Types.ObjectId,
            required: true,
            ref: User
        },
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        phone_number: {
            type: String,
            required: true,
            unique: true
        },
    },
    {
        timestamps: true,
    }
);

const Contact = mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;