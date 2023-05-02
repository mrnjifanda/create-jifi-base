const { configs, response } = require('../../configs/app.config');

const index = (req, res, next) => {

    return response.success(res, next, 'Welcom', configs.getAppInfo());
}

module.exports = { index };