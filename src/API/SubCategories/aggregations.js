import mongoose from "mongoose";

export const getSubCategoriesAggregation = ({
    userId,
    search,
    page,
    limit,
}) => [
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
        $project: {
            id: "$_id",
            _id: 0,
            name: 1,
            description: 1,
            image: 1,
            categoryId: 1,
            category: { $arrayElemAt: ["$category.name", 0] },
        },
    },
    {
        $facet: {
            metadata: [{ $count: "total" }],
            data: [{ $skip: page * limit }, { $limit: limit }],
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
            page: { $toInt: page },
            limit: { $toInt: limit },
            search: { $toString: search },
        },
    },
];
