import Joi from "joi";

export const addSubCategoryBodySchema = Joi.object().keys({
    name: Joi.string().required().trim(),
    description: Joi.string().trim().default(""),
    image: Joi.string().trim().default(""),
    categoryId: Joi.string()
        .alphanum()
        .case("lower")
        .min(24)
        .max(24)
        .required(),
});

export const getSubCategoriesBodySchema = Joi.object().keys({
    search: Joi.string().empty("").trim().default(""),
    page: Joi.number().min(0).default(0),
    limit: Joi.number().min(-1).default(5),
    categoryId: Joi.string().alphanum().case("lower").min(24).max(24),
});

export const deleteSubCategoryBodySchema = Joi.object().keys({
    subCategoryId: Joi.string()
        .alphanum()
        .case("lower")
        .min(24)
        .max(24)
        .required(),
});

export const getSubCategoryBodySchema = Joi.object().keys({
    subCategoryId: Joi.string()
        .alphanum()
        .case("lower")
        .min(24)
        .max(24)
        .required(),
});

export const updateSubCategoryParamsSchema = Joi.object().keys({
    subCategoryId: Joi.string()
        .alphanum()
        .case("lower")
        .min(24)
        .max(24)
        .required(),
});

export const updateSubCategoryBodySchema = Joi.object().keys({
    name: Joi.string().trim(),
    description: Joi.string().trim(),
    image: Joi.string().trim(),
    categoryId: Joi.string().alphanum().case("lower").min(24).max(24),
});
