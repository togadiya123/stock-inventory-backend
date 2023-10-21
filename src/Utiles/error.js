export const schemaErrorResponse = ({ error, response }) =>
    response.status(400).send({
        requestBodyError: error.details.reduce(
            (acc, cur) => ({
                ...acc,
                [cur.context.key]: cur.message,
            }),
            {},
        ),
    });
