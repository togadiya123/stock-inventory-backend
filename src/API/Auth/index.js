import {Router} from 'express';

import {login, signup, logout, validateToken} from './controller.js';
import {tokenVerify} from "../../Middleware/index.js";

export const authRouter = Router();

authRouter.route('/login').post(login);
authRouter.route('/signup').post(signup);
authRouter.use(tokenVerify).route('/').get(validateToken);
authRouter.use(tokenVerify).route('/logout').get(logout);
