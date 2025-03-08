const { BaseSchema, ROLES, Schema } = require("../../../configs/app.config");

const authSchema = {
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    passwords: {
        type: [String],
        required: true,
        default: []
    },
    confirmation_token: {
        type: String,
        required: false,
        default: null
    },
    confirmed_at: {
        type: Date,
        required: false,
        default: null
    },
    remember_token: {
        type: String,
        required: false,
        default: null
    },
    reset_password_token: {
        type: String,
        required: false,
        default: null
    },
    reset_password_at: {
        type: Date,
        required: false,
        default: null
    },
    login_history: {
        type: [
            {
                ip: {
                    type: String,
                    required: false
                },
                token: {
                    type: String,
                    required: true,
                    unique: false
                },
                refresh_token: {
                    type: String,
                    required: true,
                    unique: false
                },
                login_at: {
                    type: Date,
                    required: false,
                    default: Date.now
                },
                locations: {
                    country: { type: String, required: false },
                    city: { type: String, required: false },
                },
                devices: {
                    type: Object,
                    required: false,
                    default: {}
                }
            }
        ],
        required: false,
        default: []
    },
    role: {
        type: String,
        enum : ROLES,
        required: false,
        default: ROLES[0]
    }
};

const Auth = BaseSchema('auth', authSchema);

module.exports = Auth;
