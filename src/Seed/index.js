import { connectDatabase } from "../MongoDB/index.js";
import * as fs from "fs";
import { config } from "../Config/index.js";
import { Category, Item, SubCategory, User } from "../Models/index.js";

const DUMMY_ITEMS_PATH = "./src/Seed/ITEMS.json";

const index = async () => {
    try {
        console.log("[ *** Starting to seed database *** ]");

        const args = process.argv.slice(2).reduce(
            (acc, arg, index, array) => ({
                ...acc,
                ...(index % 2 === 0
                    ? { [arg.replace("--", "")]: array[index + 1] }
                    : {}),
            }),
            {},
        );

        config();
        await connectDatabase();
        console.log("[ * Database connected * ]");

        const user = await User.findById(args.userId);
        if (!user) throw new Error("User doesn't exists");
        console.log("[ * User found * ]");

        console.log(
            "[ * Trying to delete old Categories, SubCategories and Items * ]",
        );
        await Category.deleteMany({ userId: args.userId });
        await SubCategory.deleteMany({ userId: args.userId });
        await Item.deleteMany({ userId: args.userId });

        const data = JSON.parse(
            fs.readFileSync(DUMMY_ITEMS_PATH, { encoding: "utf-8" }),
        );

        const categories = await Category.insertMany(
            Object.keys(data).map((category) => ({
                userId: args.userId,
                name: category,
            })),
        );
        console.log(
            `[ * Total ${categories.length} numbers of Category have been created * ]`,
        );

        for (let i = 0; i < categories.length; i++) {
            const category = categories[i].toObject();
            const subCategories = await SubCategory.insertMany(
                Object.keys(data[category.name]).map((subCategory) => ({
                    userId: args.userId,
                    categoryId: category._id,
                    name: subCategory,
                })),
            );
            console.log(
                `\t[ * Total ${subCategories.length} numbers of SubCategory have been created for ${category.name} * ]`,
            );

            for (let j = 0; j < subCategories.length; j++) {
                const subCategory = subCategories[j].toObject();
                const items = await Item.insertMany(
                    Object.keys(data[category.name][subCategory.name]).map(
                        (item) => ({
                            userId: args.userId,
                            categoryId: category._id,
                            subCategoryId: subCategory._id,
                            name: item,
                            description:
                                data[category.name][subCategory.name][item]
                                    .description,
                            purchasePrice:
                                data[category.name][subCategory.name][item]
                                    .purchasePrice,
                            sellPrice:
                                data[category.name][subCategory.name][item]
                                    .sellPrice,
                            image: data[category.name][subCategory.name][item]
                                .image,
                        }),
                    ),
                );
                console.log(
                    `\t\t[ * Total ${items.length} numbers of Item have been created for ${category.name} > ${subCategory.name} * ]`,
                );
            }
        }

        console.log("[ *** Success *** ]");
    } catch (error) {
        console.error(error);
    }
};

await index();
