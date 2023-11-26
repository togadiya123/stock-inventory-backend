import mongoose from "mongoose";

export const getSubCategoriesAggregation = ({
    userId,
    search,
    page,
    limit,
    categoryId,
}) => [
    {
        $match: {
            userId: new mongoose.Types.ObjectId(userId),
            name: { $regex: search, $options: "i" },
            ...(categoryId
                ? { categoryId: new mongoose.Types.ObjectId(categoryId) }
                : {}),
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
