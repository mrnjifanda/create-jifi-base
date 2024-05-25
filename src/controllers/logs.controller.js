const Controller = require('./controller');
const logsService = require('../services/logs.service');

class LogController extends Controller {

    static instance;
    constructor() {

      if (LogController.instance) return LogController.instance;

      super();
      LogController.instance = this;
    }

    /**
     * @returns { LogController }
     */
    static getInstance() {

      if (!LogController.instance) LogController.instance = new LogController();

      return LogController.instance;
    }

    async all (req, res, next) {

        const { page = 1, limit = 10, ...filters } = req.query;
        const logs = await logsService.paginate(filters, page, limit);
        if (logs.error) {
    
            return super.failed(res, 'Find all logs error', logs.data);
        }
    
        return super.success(res, 'All logs', logs.data);
    }
    
    async findById (req, res, next) {
    
        const { selects } = req.query; 
        const log = await logsService.findOne({ _id: req.params.id }, selects);
        if (log.error || !log.data) {
    
            return super.failed(res, log.message ?? 'Log not found', log.data);
        }
    
        return super.success(res, 'Log by Id', log.data);
    }
    
    async findByUser (req, res, next) {
    
        const { page = 1, limit = 10, ...filters } = req.query;
        filters.user = req.params.id;
        const log = await logsService.paginate(filters, page, limit);
        if (log.error || !log.data) {
    
            return super.failed(res, log.message ?? 'Log not found', log.data);
        }
    
        return super.success(res, 'Log by Id', log.data);
    }
}

module.exports = LogController.getInstance();
