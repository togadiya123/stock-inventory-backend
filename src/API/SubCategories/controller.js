import { schemaErrorResponse } from "../../Utiles/index.js";
import { Category, SubCategory } from "../../Models/index.js";
import {
    addSubCategoryBodySchema,
    deleteSubCategoryBodySchema,
    getSubCategoriesBodySchema,
    getSubCategoryBodySchema,
    updateSubCategoryBodySchema,
    updateSubCategoryParamsSchema,
} from "./bodySchema.js";
import { getSubCategoriesAggregation } from "./aggregations.js";

export const addSubCategory = async (request, response) => {
    try {
        const { value, error } = addSubCategoryBodySchema.validate(
            request.body,
        );
        if (error) return schemaErrorResponse({ response, error });

        await Category.validateCategoryId({
            userId: request.user._id,
            categoryId: value.categoryId,
        });

        await SubCategory.validateUniqueName({
            userId: request.user._id,
            categoryId: value.categoryId,
            name: value.name,
        });

        await SubCategory.create({
            ...value,
            userId: request.user._id,
        });

        return response
            .status(201)
            .send({ message: `'${value.name}' sub-category is added` });
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }
};

export const getSubCategories = async (request, response) => {
    try {
        const { value, error } = getSubCategoriesBodySchema.validate(
            request.query,
        );
        if (error) return schemaErrorResponse({ response, error });

        if (value.categoryId)
            await Category.validateCategoryId({
                userId: request.user._id,
                categoryId: value.categoryId,
            });

        const categories = await SubCategory.aggregate(
            getSubCategoriesAggregation({ userId: request.user._id, ...value }),
        ).then((r) => r[0]);

        return response.status(200).send({
            ...categories,
            message: "Sub-Categories have been fetched",
        });
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }
};

export const deleteSubCategory = async (request, response) => {
    try {
        const { value, error } = deleteSubCategoryBodySchema.validate(
            request.params,
        );
        if (error) return schemaErrorResponse({ response, error });

        await SubCategory.validateSubCategoryId({
            userId: request.user._id,
            subCategoryId: value.subCategoryId,
        });
        await SubCategory.findByIdAndDelete(value.subCategoryId);

        return response
            .status(200)
            .send({ message: "Sub-Category has been deleted" });
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }
};

export const getSubCategory = async (request, response) => {
    try {
        const { value, error } = getSubCategoryBodySchema.validate(
            request.params,
        );
        if (error) return schemaErrorResponse({ response, error });

        const subCategory = await SubCategory.validateSubCategoryId({
            userId: request.user._id,
            subCategoryId: value.subCategoryId,
        });

        return response.status(200).send({
            subCategory: await subCategory.format(),
            message: "Sub-Category has been fetched",
        });
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }
};

export const updateSubCategory = async (request, response) => {
    try {
        const paramsValidation = updateSubCategoryParamsSchema.validate(
            request.params,
        );
        if (paramsValidation.error)
            return schemaErrorResponse({
                response,
                error: paramsValidation.error,
            });

        const { value, error } = updateSubCategoryBodySchema.validate(
            request.body,
        );
        if (error) return schemaErrorResponse({ response, error });

        const subCategory = await SubCategory.validateSubCategoryId({
            userId: request.user._id,
            subCategoryId: paramsValidation.value.subCategoryId,
        });

        if (value.categoryId) {
            await Category.validateCategoryId({
                userId: request.user._id,
                categoryId: value.categoryId,
            });
        }

        if (value.name) {
            await SubCategory.validateUniqueName({
                userId: request.user._id,
                categoryId: subCategory.categoryId,
                name: value.name,
            });
        }

        await SubCategory.findByIdAndUpdate(
            paramsValidation.value.subCategoryId,
            {
                ...value,
            },
            {
                strict: true,
            },
        );

        return response
            .status(200)
            .send({ message: "Sub-Category has been updated" });
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }
};
