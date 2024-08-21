import express, { Router } from "express";

import { genLimit } from "../../../libs/security/rateLimit";

import { register, login, logout } from "../../../controllers/v1/auth/index.controller";

const authRouter: Router = express.Router();

const RATE_LIMIT = 5;

authRouter.post('/register', genLimit(RATE_LIMIT), register);
authRouter.post('/login', genLimit(RATE_LIMIT), login);
authRouter.get('/logout', logout);

export default authRouter;