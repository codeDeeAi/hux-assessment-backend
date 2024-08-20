import { rateLimit } from 'express-rate-limit'
import ApiResponse from '../support/apiResponse';
import Env from '../support/env';

const TIME_IN_MINS = Env.RATE_LIMIT_TIME_IN_MINS || 15;
const TIME_IN_MILLISECS = TIME_IN_MINS * 60 * 1000; // 15 minutes
const MAX_NO_OF_REQS = Env.RATE_LIMIT_MAX_NO_OF_REQS || 100; // Limit each IP to 100 requests per `window` (here, per 15 minutes)
const USE_STANDARD_HEADERS = Env.RATE_LIMIT_USE_STANDARD_HEADERS || true; // Return rate limit info in the `RateLimit-*` headers
const USE_LEGACY_HEADERS = Env.RATE_LIMIT_USE_LEGACY_HEADERS || false; // Disable the `X-RateLimit-*` headers

export const genLimit = (limit: number, max: number = MAX_NO_OF_REQS) => {
    return rateLimit({
        windowMs: TIME_IN_MILLISECS,
        max: max,
        limit: limit,
        standardHeaders: USE_STANDARD_HEADERS,
        legacyHeaders: USE_LEGACY_HEADERS,
        validate: { trustProxy: false, xForwardedForHeader: true },
        handler: (req, res, next, options) =>
            ApiResponse.error(res, options.statusCode, options.message, options.message)

    });
};

const limiter = rateLimit({
    windowMs: TIME_IN_MILLISECS,
    max: MAX_NO_OF_REQS,
    standardHeaders: USE_STANDARD_HEADERS,
    legacyHeaders: USE_LEGACY_HEADERS,
    validate: { trustProxy: false, xForwardedForHeader: true },
    handler: (req, res, next, options) =>
        ApiResponse.error(res, options.statusCode, options.message, options.message)

});

export default limiter;