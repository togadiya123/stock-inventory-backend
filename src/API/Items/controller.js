import { schemaErrorResponse } from "../../Utiles/index.js";
import { Category, Item, SubCategory } from "../../Models/index.js";
import {
    getItemsBodySchema,
    addItemBodySchema,
    deleteItemBodySchema,
    getItemBodySchema,
    updateItemBodySchema,
    updateItemsParamsSchema,
} from "./bodySchema.js";
import { getItemsAggregation } from "./aggregations.js";

export const addItem = async (request, response) => {
    try {
        const { value, error } = addItemBodySchema.validate(request.body);
        if (error) return schemaErrorResponse({ response, error });

        await Category.validateCategoryId({
            userId: request.user._id,
            categoryId: value.categoryId,
        });

        await SubCategory.validateSubCategoryId({
            userId: request.user._id,
            categoryId: value.categoryId,
            subCategoryId: value.subCategoryId,
        });

        await Item.validateUniqueName({
            userId: request.user._id,
            categoryId: value.categoryId,
            subCategoryId: value.subCategoryId,
            name: value.name,
        });

        await Item.create({
            ...value,
            userId: request.user._id,
        });

        return response
            .status(201)
            .send({ message: `'${value.name}' item has been added` });
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }
};

export const getItems = async (request, response) => {
    try {
        const { value, error } = getItemsBodySchema.validate(request.query);
        if (error) return schemaErrorResponse({ response, error });

        const items = await Item.aggregate(
            getItemsAggregation({ userId: request.user._id, ...value }),
        ).then((r) => r[0]);

        return response
            .status(200)
            .send({ ...items, message: "Items have been fetched" });
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }
};

export const deleteItem = async (request, response) => {
    try {
        const { value, error } = deleteItemBodySchema.validate(request.params);
        if (error) return schemaErrorResponse({ response, error });

        await Item.validateItemId({
            userId: request.user._id,
            itemId: value.itemId,
        });
        await Item.deleteOne({ _id: value.itemId, userId: request.user._id });

        return response.status(200).send({ message: "Item has been deleted" });
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }
};

export const getItem = async (request, response) => {
    try {
        const { value, error } = getItemBodySchema.validate(request.params);
        if (error) return schemaErrorResponse({ response, error });

        const item = await Item.validateItemId({
            userId: request.user._id,
            itemId: value.itemId,
        });

        return response.status(200).send({
            item: await item.format(),
            message: "Item has been fetched",
        });
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }
};

export const updateItem = async (request, response) => {
    try {
        const paramsValidation = updateItemsParamsSchema.validate(
            request.params,
        );
        if (paramsValidation.error)
            return schemaErrorResponse({
                response,
                error: paramsValidation.error,
            });

        const { value, error } = updateItemBodySchema.validate(request.body);
        if (error) return schemaErrorResponse({ response, error });

        const item = await Item.validateItemId({
            userId: request.user._id,
            itemId: paramsValidation.value.itemId,
        });

        if (value.categoryId)
            await Category.validateCategoryId({
                userId: request.user._id,
                categoryId: value.categoryId,
            });

        if (value.subCategoryId)
            await SubCategory.validateSubCategoryId({
                userId: request.user._id,
                categoryId: value.categoryId,
                subCategoryId: value.subCategoryId,
            });

        if (value.name)
            await Item.validateUniqueName({
                userId: request.user._id,
                categoryId: item.categoryId,
                subCategoryId: item.subCategoryId,
                name: value.name,
            });

        await Item.findByIdAndUpdate(
            paramsValidation.value.itemId,
            {
                ...value,
            },
            {
                strict: true,
            },
        );

        return response.status(200).send({ message: "Item has been updated" });
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }
};
