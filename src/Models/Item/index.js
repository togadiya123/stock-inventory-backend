import {Schema, model} from "mongoose";
const validateUniqueName = async function ({userId, name}) {
    const existingItem = await this.findOne({name, userId});
    if (existingItem)
        throw new Error(`'${name}' named item already exists`);
    return true;
};

const validateItemId = async function ({userId, itemId}) {
    const existingItemCollection = await this.findOne({_id: itemId, userId});
    if (!existingItemCollection)
        throw new Error('Selected item doesn\'t exists');
    return true;
};

const itemSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ""
    },
    category: {
        type: String,
        trim: true,
        required: true,
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
}, {
    timestamps: true,
    statics: {
        validateUniqueName,
        validateItemId,
    }
});

export const Item = model("Item", itemSchema);
