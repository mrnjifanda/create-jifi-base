const { response } = require('../../../configs/app.config');
const authService = require('../../services/auth/auth.service');

const register = async (req, res, next) => {

    const data = await authService.register(req.body);
    if (data.error) return response.failed(res, data.message);

    return response.success(res, next, 'User created successfully', data.data, 201);
};

const activate_account = async (req, res, next) => {

    const data = await authService.activateAccount(req.body);
    if (data.error) return response.failed(res, data.message);

    return response.success(res, next, 'Account successfully activated');
};

const login = async (req, res, next) => {

    const data = await authService.login(req.body, true);
    if (data.error) return response.failed(res, 'The username and password you entered do not match any accounts on record');

    return response.success(res, next, 'Connection completed successfully', data.data);
};

module.exports = { register, activate_account, login };