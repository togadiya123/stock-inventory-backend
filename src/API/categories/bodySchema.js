import Joi from "joi";

export const addCategoryBodySchema = Joi.object().keys({
    name: Joi.string().required().trim(),
    description: Joi.string().trim().default(""),
    image: Joi.string().trim().default(""),
});

export const getCategoriesBodySchema = Joi.object().keys({
    search: Joi.string().empty("").trim().default(""),
    page: Joi.number().min(0).default(0),
    limit: Joi.number().min(5).default(5),
});

export const deleteCategoryBodySchema = Joi.object().keys({
    categoryId: Joi.string()
        .alphanum()
        .case("lower")
        .min(24)
        .max(24)
        .required(),
});

export const getCategoryBodySchema = Joi.object().keys({
    categoryId: Joi.string()
        .alphanum()
        .case("lower")
        .min(24)
        .max(24)
        .required(),
});

export const updateCategoryParamsSchema = Joi.object().keys({
    categoryId: Joi.string()
        .alphanum()
        .case("lower")
        .min(24)
        .max(24)
        .required(),
});

export const updateCategoryBodySchema = Joi.object().keys({
    name: Joi.string().trim(),
    description: Joi.string().trim(),
    image: Joi.string().trim(),
});
