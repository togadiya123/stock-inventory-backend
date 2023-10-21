import jwt from "jsonwebtoken";

import { Token } from "../../Models/index.js";

export const tokenVerify = async (request, response, next) => {
    try {
        if (!request.headers.authorization)
            return response
                .status(401)
                .send({ error: "Authorization header is not present" });

        const token = request.header("authorization").replace("Bearer ", "");

        const tokenObj = await Token.findOne({ accessToken: token });
        if (!tokenObj)
            return response.status(403).send({ error: "Token is not valid" });

        jwt.verify(
            token,
            process.env.JWT_PRIVATE_KEY,
            {},
            async (error, decoded) => {
                if (error)
                    return response
                        .status(403)
                        .send({ error: "Token is not valid" });

                const { userId } = tokenObj;
                if (decoded._id !== userId?.toString())
                    return response
                        .status(403)
                        .send({ error: "Token is not valid" });

                request.user = {
                    _id: decoded._id,
                    token: tokenObj,
                };
                next();
            },
        );
    } catch (error) {
        return response.status(400).send({ error: error.message });
    }
};
