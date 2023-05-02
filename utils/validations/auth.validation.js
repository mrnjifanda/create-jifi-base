const { Joi, Validation, ROLES, PASSWORD_REGEX } = require("../../configs/app.config");

const register = (req, res, next) => {

    return Validation (req.body, {
        last_name: Joi.string().min(2).max(50),
        first_name: Joi.string().min(2).max(50),
        username: Joi.string().alphanum().min(4).max(12),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(PASSWORD_REGEX).required(),
        password_confirm: Joi.string().required().valid(Joi.ref('password')),
        role: Joi.string().valid(...ROLES).uppercase(),
    }, res, next);
};

const login = (req, res, next) => {

    return Validation(req.body, {
        email: Joi.string().email().required(),
        password: Joi.string().pattern(PASSWORD_REGEX).required()
    }, res, next);
};

const activate_account = (req, res, next) => {

    return Validation(req.body, {
        email: Joi.string().email().required(),
        code: Joi.string().required()
    }, res, next);
}

module.exports = { register, activate_account, login };