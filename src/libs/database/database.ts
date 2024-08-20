import mongoose from "mongoose";
import env from "dotenv";
import Env from "../support/env";

env.config();

const MONGODB_URI: string = Env.DATABASE_URL;

const MONGODB_OPTIONS: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

/**
 * Connects app database
 * @returns {Promise<typeof mongoose>}
 */
const dbConnect = async (): Promise<typeof mongoose> => {
    try {

        return await mongoose.connect(MONGODB_URI, MONGODB_OPTIONS);

    } catch (error: any) {
        
        throw new Error("Error connecting to mongodb");
    }
};

export default dbConnect;
