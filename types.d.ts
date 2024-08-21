import { Types } from "mongoose";

declare module 'express-serve-static-core' {
    interface Request {
        user_id?: Types.ObjectId | string;
    }
}