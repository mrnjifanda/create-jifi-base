const BaseService = require("../../../utils/bases/base.service");
const Log = require("../../models/log.model");

class LogsService extends BaseService {

    static instance;
    constructor() {

        if (LogsService.instance) return LogsService.instance;
        super(Log);
        LogsService.instance = this;
    }

    /**
     * @returns { LogsService }
     */
    static getInstance() {

        if (!LogsService.instance) LogsService.instance = new LogsService();
        return LogsService.instance;
    }
}

module.exports = LogsService.getInstance();
