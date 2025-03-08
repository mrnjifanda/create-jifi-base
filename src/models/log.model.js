const { Schema, BaseSchema } = require("../../configs/app.config");

const Log = BaseSchema('logs', {
    ip: {
        type: String,
        required: false,
        default: null
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: false,
        default: null
    },
    method: {
        type: String,
        required: false,
        default: null
    },
    hostname: {
        type: String,
        required: false,
        default: null
    },
    url: {
        type: String,
        required: false,
        default: null
    },
    status_code: {
        type: Number,
        require: false,
        default: 200
    },
    action: {
        type: String,
        default: 'insert'
    },
    entity: {
        type: String,
        required: false,
        default: null
    },
    details: {
        type: Object,
        default: {}
    },
    request_body: {
        type: Object,
        require: true,
        default: {}
    },
    response_body: {
        type: Object,
        require: true,
        default: {}
    },
    execution_time: {
        type: Number,
        require: true
    }
});

module.exports = Log;