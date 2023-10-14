import bcrypt from 'bcrypt';

import {loginBodySchema, sighupBodySchema} from './bodySchema.js';
import {schemaErrorResponse} from "../../Utiles/index.js";
import {User, Password, Token} from "../../Models/index.js";

export const login = async (request, response) => {
    try {
        const {value, error} = loginBodySchema.validate(request.body);
        if (error) return schemaErrorResponse({response, error});

        const user = await User.findOne({email: value.email}, {_id: 1, firstName: 1, lastName: 1, email: 1});
        if (!user) return response.status(400).json({
            message: `User does not exist`,
            error: `User with email ${value.email} does not exist`
        });

        await user.matchPassword({password: value.password});

        const token = await user.generateAuthToken();

        delete user._doc._id;

        return response.status(200).json({
            message: `Welcome back ${user.firstName}`, token, user
        });

    } catch (error) {
        response.status(400).send({message: error.message, error: error.message});
    }
};

export const signup = async (request, response) => {
    try {
        const {value, error} = sighupBodySchema.validate(request.body, {abortEarly: false});
        if (error) return schemaErrorResponse({response, error});

        const userIsExist = User.findOne({email: value.email});
        if (userIsExist) return response.status(400).json({
            message: `User with email ${value.email} already exist`, error: 'User already exist'
        });

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(value.password, salt);

        const user = await User.create({
            firstName: value.firstName, lastName: value.lastName, email: value.email,
        });

        await Password.create({
            password: hashPassword, userId: user._id,
        });

        response.status(200).send({message: "User created successfully"});
    } catch (error) {
        response.status(400).send({error: error.message});
    }
};

export const validateToken = async (request, response) => {
    try {

        const user = await User.findById(request.user._id, {_id: 0, firstName: 1, lastName: 1, email: 1});

        response.status(200).send({message: "Token is valid", user});
    } catch (error) {
        response.status(400).send({message: "Authentication required",error: error.message});
    }
};

export const logout = async (request, response) => {
    try {
        const tokenObj = await Token.findOne({userId: request.user._id, accessToken: request.user.token.accessToken});
        await tokenObj.revoke();
        response.status(200).send({message: "Logout successful"});
    } catch (error) {
        response.status(400).send({error: error.message});
    }
};
