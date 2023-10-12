import {Router} from "express";

import {authRouter} from './Auth/index.js';
import {itemsRouter} from "./Items/index.js";
import {imageRouter} from "./Image/index.js";

export const router = Router();

router.use('/auth', authRouter);
router.use('/items', itemsRouter);
router.use('/image', imageRouter)

router.use("/", (_, response) => response.send("Welcome to the Stock Inventory API"));
