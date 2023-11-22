import { Schema, model } from "mongoose";

const validateUniqueName = async function ({ userId, categoryId, name }) {
    const existingSubCategory = await this.findOne({
        name,
        categoryId,
        userId,
    });
    if (existingSubCategory)
        throw new Error(`'${name}' named sub-category already exists`);
    return true;
};

const validateSubCategoryId = async function ({ userId, subCategoryId }) {
    const existingSubCategory = await this.findOne(
        { _id: subCategoryId, userId },
        {
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        },
    );
    if (!existingSubCategory)
        throw new Error("Selected sub-category doesn't exists");
    return existingSubCategory;
};

const format = async function () {
    return {
        ...this.toObject(),
        id: this._id,
        category: (
            await this.model("Category").validateCategoryId({
                userId: this.userId,
                categoryId: this.categoryId,
            })
        )?.name,
        userId: undefined,
        _id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        __v: undefined,
    };
};

const subCategorySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Category",
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
            validateSubCategoryId,
        },
        methods: {
            format,
        },
    },
);

export const SubCategory = model(
    "SubCategory",
    subCategorySchema,
    "SubCategories",
);
