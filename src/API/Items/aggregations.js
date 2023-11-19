import mongoose from "mongoose";

export const getItemsAggregation = ({ userId, search, page, limit }) => [
    {
        $match: {
            userId: new mongoose.Types.ObjectId(userId),
            name: { $regex: search, $options: "i" },
        },
    },
    {
        $sort: {
            name: 1,
        },
    },
    {
        $lookup: {
            from: "Categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
        },
    },
    {
        $lookup: {
            from: "SubCategories",
            localField: "subCategoryId",
            foreignField: "_id",
            as: "subCategory",
        },
    },
    {
        $project: {
            id: "$_id",
            _id: 0,
            name: 1,
            description: 1,
            purchasePrice: 1,
            sellPrice: 1,
            image: 1,
            categoryId: 1,
            subCategoryId: 1,
            category: { $arrayElemAt: ["$category.name", 0] },
            subCategory: { $arrayElemAt: ["$subCategory.name", 0] },
        },
    },
    {
        $facet: {
            metadata: [{ $count: "total" }],
            data:
                limit === -1
                    ? []
                    : [{ $skip: page * limit }, { $limit: limit }],
        },
    },
    {
        $project: {
            data: 1,
            total: { $arrayElemAt: ["$metadata.total", 0] },
        },
    },
    {
        $addFields: {
            total: { $ifNull: ["$total", 0] },
            page: { $toInt: limit === -1 ? 0 : page },
            limit: { $toInt: limit },
            search: { $toString: search },
        },
    },
];
