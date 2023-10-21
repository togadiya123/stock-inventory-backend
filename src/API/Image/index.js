import { Router } from "express";
import multer from "multer";

import { uploadImage } from "./controller.js";
import { tokenVerify } from "../../Middleware/index.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: 1 });

export const imageRouter = Router();

imageRouter.use(tokenVerify);
imageRouter.use(upload.single("image"));

imageRouter.route("/").post(uploadImage);
