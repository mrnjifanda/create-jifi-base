const { BaseSchema, Schema } = require("../../../configs/app.config");

const xApiKeySchema = {
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    keys: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum : [ 'ACTIVE', 'INACTIVE' ],
        required: false,
        default: 'INACTIVE'
    },
};

const xApiKey = BaseSchema('x_api_keys', xApiKeySchema);

module.exports = xApiKey;
