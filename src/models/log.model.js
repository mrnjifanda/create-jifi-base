const { mongoose, BaseSchema } = require("../../configs/app.config");

const Log = BaseSchema('logs', {
    ip: {
        type: String,
        required: false,
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
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
    response_body: {
        type: Object,
        require: true,
        default: {}
    },
    response_time: {
        type: Number,
        require: false,
        default: 0
    }
});

module.exports = Log;