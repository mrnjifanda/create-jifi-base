const { response } = require('../../configs/app.config');
const logsService = require('../services/logs.service');

const all = async (req, res, next) => {


    const { page = 1, limit = 10, ...filters } = req.query;
    const logs = await logsService.paginate(filters, page, limit);
    if (logs.error) {

        return response.failed(res, next, 'Find all logs error', logs.data);
    }

    return response.success(res, next, 'All logs', logs.data);
}

const findById = async (req, res, next) => {

    const { selects } = req.query; 
    const log = await logsService.findOne({ _id: req.params.id }, selects);
    if (log.error || !log.data) {

        return response.failed(res, next, log.message ?? 'Log not found', log.data);
    }

    return response.success(res, next, 'Log by Id', log.data);
}

const findByUser = async (req, res, next) => {

    const { page = 1, limit = 10, ...filters } = req.query;
    filters.user = req.params.id;
    const log = await logsService.paginate(filters, page, limit);
    if (log.error || !log.data) {

        return response.failed(res, next, log.message ?? 'Log not found', log.data);
    }

    return response.success(res, next, 'Log by Id', log.data);
}

module.exports = { all, findById, findByUser };