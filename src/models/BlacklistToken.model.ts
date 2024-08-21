import mongoose, { Schema, Types, Document } from 'mongoose';

export interface IBlackListToken extends Document {
    _id: Types.ObjectId;
    token: string;
    createdAt: Date | null;
    updatedAt: Date | null;
};

const BlacklistTokenSchema = new Schema(
    {
        token: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const BlackListToken = mongoose.model<IBlackListToken>("Contact", BlacklistTokenSchema);

export default BlackListToken;