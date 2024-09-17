const { response } = require('../../configs/app.config');

class Controller {

    success (res, message, data = null, status_code = 200, status = 'success') {

        return response.success(res, null, message, data, status_code, status);
    }

    failed (res, message, data = null, status_code = 401, status = 'failed') {

        return response.failed(res, null, message, data, status_code, status);
    }
    unprocessable (res, data = null) {

        return response.unprocessable(res, null, data);
    }
}

module.exports = Controller;
