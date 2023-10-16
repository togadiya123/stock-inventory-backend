import mongoose from "mongoose";

export const getItemsAggregation = ({userId, search, page, limit}) => [
    {
        $match: {
            userId: new mongoose.Types.ObjectId(userId),
            name: {$regex: search, $options: "i"},
        }
    }, {
        $sort: {
            'name': 1
        }
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
            category : 1
        }
    }, {
        $facet: {
            metadata: [{$count: 'total'}], data: [{$skip: (page) * limit}, {$limit: limit}],
        }
    }, {
        $project: {
            data: 1, total: {$arrayElemAt: ['$metadata.total', 0]},
        }
    }, {
        $addFields: {
            total: {$ifNull: ["$total", 0]}, page: {$toInt: page}, limit: {$toInt: limit}, search: {$toString: search}
        }
    }
];
