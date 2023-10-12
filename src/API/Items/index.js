import {Router} from 'express';
import {addItem,deleteItem, getItems} from './controller.js';
import {tokenVerify} from "../../Middleware/index.js";

export const itemsRouter = Router();

itemsRouter.use(tokenVerify);

itemsRouter.route('/').get(getItems);
itemsRouter.route('/add').post(addItem);
itemsRouter.route('/:itemId').delete(deleteItem);