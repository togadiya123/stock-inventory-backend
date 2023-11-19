import { Schema, model } from "mongoose";

const validateUniqueName = async function ({ userId, name }) {
    const existingCategory = await this.findOne({ name, userId });
    if (existingCategory)
        throw new Error(`'${name}' named category already exists`);
    return true;
};

const validateCategoryId = async function ({ userId, categoryId }) {
    const existingCategory = await this.findOne(
        { _id: categoryId, userId },
        {
            createdAt: 0,
            updatedAt: 0,
            userId: 0,
            __v: 0,
        },
    );
    if (!existingCategory) throw new Error("Selected category doesn't exists");
    return existingCategory;
};

const categorySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        image: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
        statics: {
            validateUniqueName,
            validateCategoryId,
        },
    },
);

export const Category = model("Category", categorySchema, "Categories");
