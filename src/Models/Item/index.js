import { model, Schema } from "mongoose";

const validateUniqueName = async function ({
    userId,
    name,
    categoryId,
    subCategoryId,
}) {
    const existingItem = await this.findOne({
        name,
        userId,
        categoryId,
        subCategoryId,
    });
    if (existingItem) throw new Error(`'${name}' named item already exists`);
    return true;
};

const validateItemId = async function ({ userId, itemId }) {
    const existingItem = await this.findOne(
        { _id: itemId, userId },
        {
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        },
    );
    if (!existingItem) throw new Error("Selected item doesn't exists");
    return existingItem;
};

const format = async function () {
    return {
        ...this.toObject(),
        id: this.id,
        category: (
            await this.model("Category").validateCategoryId({
                userId: this.userId,
                categoryId: this.categoryId,
            })
        )?.name,
        subCategory: (
            await this.model("SubCategory").validateSubCategoryId({
                userId: this.userId,
                categoryId: this.categoryId,
                subCategoryId: this.subCategoryId,
            })
        )?.name,
        userId: undefined,
        _id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        __v: undefined,
    };
};

const itemSchema = new Schema(
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
        categoryId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Category",
        },
        subCategoryId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "SubCategory",
        },
        image: {
            type: String,
            trim: true,
        },
        purchasePrice: {
            type: String,
            trim: true,
            required: true,
        },
        sellPrice: {
            type: String,
            trim: true,
            required: true,
        },
    },
    {
        timestamps: true,
        statics: {
            validateUniqueName,
            validateItemId,
        },
        methods: {
            format,
        },
    },
);

export const Item = model("Item", itemSchema, "Items");
