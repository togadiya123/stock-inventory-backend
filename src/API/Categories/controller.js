import { schemaErrorResponse } from "../../Utiles/index.js";
import { Category } from "../../Models/index.js";
import {
    getCategoriesBodySchema,
    addCategoryBodySchema,
    deleteCategoryBodySchema,
    getCategoryBodySchema,
    updateCategoryParamsSchema,
    updateCategoryBodySchema,
} from "./bodySchema.js";
import { getCategoriesAggregation } from "./aggregations.js";

export const addCategory = async (request, response) => {
    try {
        const { value, error } = addCategoryBodySchema.validate(request.body);
        if (error) return schemaErrorResponse({ response, error });

        await Category.validateUniqueName({
            userId: request.user._id,
            name: value.name,
        });

        const category = await Category.create({
            ...value,
            userId: request.user._id,
        });

        return response.status(201).send({
            message: `'${value.name}' category is added`,
            category: await category.format(),
        });
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }
};

export const getCategories = async (request, response) => {
    try {
        const { value, error } = getCategoriesBodySchema.validate(
            request.query,
        );
        if (error) return schemaErrorResponse({ response, error });

        const categories = await Category.aggregate(
            getCategoriesAggregation({ userId: request.user._id, ...value }),
        ).then((r) => r[0]);

        return response
            .status(200)
            .send({ ...categories, message: "Categories have been fetched" });
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }
};

export const deleteCategory = async (request, response) => {
    try {
        const { value, error } = deleteCategoryBodySchema.validate(
            request.params,
        );
        if (error) return schemaErrorResponse({ response, error });

        await Category.validateCategoryId({
            userId: request.user._id,
            categoryId: value.categoryId,
        });
        await Category.deleteOne({
            _id: value.categoryId,
            userId: request.user._id,
        });

        return response
            .status(200)
            .send({ message: "Category has been deleted" });
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }
};

export const getCategory = async (request, response) => {
    try {
        const { value, error } = getCategoryBodySchema.validate(request.params);
        if (error) return schemaErrorResponse({ response, error });

        const category = await Category.validateCategoryId({
            userId: request.user._id,
            categoryId: value.categoryId,
        });

        return response.status(200).send({
            category: {
                id: category.id,
                ...category.toObject(),
                _id: undefined,
            },
            message: "Category has been fetched",
        });
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }
};

export const updateCategory = async (request, response) => {
    try {
        const paramsValidation = updateCategoryParamsSchema.validate(
            request.params,
        );
        if (paramsValidation.error)
            return schemaErrorResponse({
                response,
                error: paramsValidation.error,
            });

        await Category.validateCategoryId({
            userId: request.user._id,
            categoryId: paramsValidation.value.categoryId,
        });

        const { value, error } = updateCategoryBodySchema.validate(
            request.body,
        );
        if (error) return schemaErrorResponse({ response, error });

        if (value.name)
            await Category.validateUniqueName({
                userId: request.user._id,
                name: value.name,
            });

        await Category.findByIdAndUpdate(
            paramsValidation.value.categoryId,
            {
                ...value,
            },
            {
                strict: true,
            },
        );

        return response
            .status(200)
            .send({ message: "Category has been updated" });
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }
};
