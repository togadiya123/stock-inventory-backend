import { Router } from "express";
import {
    addCategory,
    deleteCategory,
    getCategories,
    getCategory,
    updateCategory,
} from "./controller.js";
import { tokenVerify } from "../../Middleware/index.js";

export const categoriesRouter = Router();

categoriesRouter.use(tokenVerify);

categoriesRouter.route("/").get(getCategories);
categoriesRouter.route("/add").post(addCategory);
categoriesRouter
    .route("/:categoryId")
    .delete(deleteCategory)
    .get(getCategory)
    .patch(updateCategory);
