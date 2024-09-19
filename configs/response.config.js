function response(res, next, message, status_code, status, data = null) {

    const format = {
        status_code,
        status: status.toUpperCase(),
        message: message,
        ...(data && { data })
    };

    res.status(status_code).json(format);
    // if (next) next();
}

function success(res, next, message, data = null, status_code = 200, status = 'success') {

    return response(res, next, message, status_code, status, data);
}

function failed(res, next, message, data = null, status_code = 401, status = 'failed') {

    return response(res, next, message, status_code, status, data);
}

function unprocessable(res, next, data = null) {

    return failed(res, next, 'There are errors in the request', data, 422);
}

function internalError(res, next, error) {

    const message = error.message || 'Internal Server Error';
    const code = error.status || 500;
    console.log(error);
    return failed(res, next, message, null, code);
}

function notFound(res, next, message, data = null) {

    return failed(res, next, message, data, 404);
}

function forbidden (res, next, message = 'This page requires a login, please login!!!') {

    return failed(res, next, message, null, 403);
}

module.exports = { response, success, failed, unprocessable, notFound, internalError, forbidden };
