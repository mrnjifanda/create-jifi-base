const BaseService = require("./base.service");
const Log = require("../models/log.model");

class LogsService extends BaseService {

    constructor() {

        super(Log);
    }
}

module.exports = new LogsService();