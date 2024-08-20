import cors from 'cors';
import Env from '../support/env';

const allowed_urls: string = Env.ALLOWED_CORS_URLS;

const whitelist: Array<string> = allowed_urls.split(",") || [];

const corsOptions = {
    origin: (origin: any, callback: any) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

const defaultCors = cors();
const corsWithOptions = cors(corsOptions);

const options = { corsWithOptions, defaultCors };

export default options;