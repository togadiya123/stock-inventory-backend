import Joi from "joi";

export const addItemBodySchema = Joi.object().keys({
    name: Joi.string().required().trim(),
    description: Joi.string().trim().default(""),
    image: Joi.string().trim(),
    purchasePrice: Joi.number().required(),
    sellPrice: Joi.number().required(),
    categoryId: Joi.string()
        .alphanum()
        .case("lower")
        .min(24)
        .max(24)
        .required(),
    subCategoryId: Joi.string()
        .alphanum()
        .case("lower")
        .min(24)
        .max(24)
        .required(),
});

export const getItemsBodySchema = Joi.object().keys({
    search: Joi.string().empty("").trim().default(""),
    page: Joi.number().min(0).default(0),
    limit: Joi.number().min(5).default(5),
});

export const deleteItemBodySchema = Joi.object().keys({
    itemId: Joi.string().alphanum().case("lower").min(24).max(24).required(),
});

export const getItemBodySchema = Joi.object().keys({
    itemId: Joi.string().alphanum().case("lower").min(24).max(24).required(),
});

export const updateItemsParamsSchema = Joi.object().keys({
    itemId: Joi.string().alphanum().case("lower").min(24).max(24).required(),
});

export const updateItemBodySchema = Joi.object().keys({
    name: Joi.string().trim(),
    description: Joi.string().trim(),
    image: Joi.string().trim(),
    purchasePrice: Joi.number(),
    sellPrice: Joi.number(),
    categoryId: Joi.string().alphanum().case("lower").min(24).max(24),
    subCategoryId: Joi.string().alphanum().case("lower").min(24).max(24),
});
