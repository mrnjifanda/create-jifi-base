const { BaseSchema } = require("../../../configs/app.config");

const userSchema = {
    last_name: {
        type: String,
        required: false,
        default: null
    },
    first_name: {
        type: String,
        required: false,
        default: null
    },
    username: {
        type: String,
        required: false,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
};

const User = BaseSchema('users', userSchema);

module.exports = User;
