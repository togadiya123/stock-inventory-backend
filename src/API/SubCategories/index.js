import { Router } from "express";
import {
    addSubCategory,
    deleteSubCategory,
    getSubCategories,
    getSubCategory,
    updateSubCategory,
} from "./controller.js";
import { tokenVerify } from "../../Middleware/index.js";

export const subCategoriesRouter = Router();

subCategoriesRouter.use(tokenVerify);

subCategoriesRouter.route("/").get(getSubCategories);
subCategoriesRouter.route("/add").post(addSubCategory);
subCategoriesRouter
    .route("/:subCategoryId")
    .delete(deleteSubCategory)
    .get(getSubCategory)
    .patch(updateSubCategory);
