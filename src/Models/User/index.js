import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import { Token } from "../Token/index.js";
import { Password } from "../Password/index.js";
import bcrypt from "bcrypt";

const generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_PRIVATE_KEY);
    await Token.create({
        userId: this._id,
        accessToken: token,
    });
    return token;
};

const matchPassword = async function ({ password }) {
    const passwordObj = await Password.findOne({
        userId: this._id,
        status: "ACTIVE",
    });
    if (!passwordObj)
        throw new Error(
            "Password does not set till. Generate a new password though the forgot password",
        );

    if (!(await bcrypt.compare(password, passwordObj?.password)))
        throw new Error("Enter the valid password");
};

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
    },
    {
        timestamps: true,
        methods: {
            generateAuthToken,
            matchPassword,
        },
    },
);

export const User = model("User", userSchema);
