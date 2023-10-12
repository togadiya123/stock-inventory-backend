import express from "express";
import cors from "cors";

import {router} from "../API/index.js";

const server = async () => {
    try {
        const app = express();

        app.use(express.json());
        app.use(cors());
        app.use("/", router);

        return app;
    } catch (error) {
        console.log(error);
    }
};

export {
    server
}
