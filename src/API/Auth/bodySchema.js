import Joi from "joi";

export const sighupBodySchema = Joi.object().keys({
    firstName: Joi.string().required().trim(),
    lastName: Joi.string().required().trim(),
    email: Joi.string().email().required().trim(),
    password: Joi.string()
        .pattern(
            new RegExp(
                "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})",
            ),
        )
        .required()
        .trim()
        .options({
            messages: {
                "string.pattern.base":
                    "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
            },
        }),
    confirmPassword: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .options({ messages: { "any.only": "{{#label}} does not match." } }),
});

export const loginBodySchema = Joi.object().keys({
    email: Joi.string().email().required().trim(),
    password: Joi.string().required().trim(),
});
