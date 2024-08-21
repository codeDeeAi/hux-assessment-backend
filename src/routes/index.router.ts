import express, { Router } from "express";

import authRouter from "./v1/auth/index.router";
import contactRouter from "./v1/contacts/index.router";
import { protect } from "../middleware/auth.middleware";

const v1Router: Router = express.Router();

v1Router.use('/v1', authRouter);
v1Router.use('/v1', protect, contactRouter);

export default v1Router;