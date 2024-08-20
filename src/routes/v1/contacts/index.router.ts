import express, { Router } from "express";
import {
    show,
    index,
    create,
    update,
    destroy
} from "../../../controllers/v1/contacts/index.controller";

const contactRouter: Router = express.Router();

contactRouter.get('/contacts', index);
contactRouter.post('/contact', create);
contactRouter.get('/contact/:id', show);
contactRouter.patch('/contact/:id', update);
contactRouter.delete('/contact/:id', destroy);

export default contactRouter;