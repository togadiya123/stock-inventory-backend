import { server } from "./Server/index.js";
import { config } from "./Config/index.js";
import { connectDatabase } from "./MongoDB/index.js";

export const main = async () => {
    try {
        config();

        const app = await server();
        await connectDatabase();
        app.listena(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

await main();
