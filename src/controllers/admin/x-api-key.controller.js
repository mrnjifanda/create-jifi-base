const BaseController = require('../../../utils/bases/base.controller');
const xApiKeyService = require('../../services/admin/x-api-key.service');

class XApiKeyController extends BaseController {

    static instance;
    constructor() {

      if (XApiKeyController.instance) return XApiKeyController.instance;

      super();
      XApiKeyController.instance = this;
    }

    /**
     * @returns { XApiKeyController }
     */
    static getInstance() {

      if (!XApiKeyController.instance) XApiKeyController.instance = new XApiKeyController();

      return XApiKeyController.instance;
    }

    async find (req, res, next) {

        const { page = 1, limit = 10, ...filters } = req.query;
        const keys = await xApiKeyService.paginate(filters, page, limit);
        if (keys.error) {
    
            return super.failed(res, 'Find all keys error', keys.data);
        }
    
        return super.success(res, 'All keys', keys.data);
    }

    async create (req, res, next) {

      const keys = await xApiKeyService.paginate(filters, page, limit);
      if (keys.error) {
  
          return super.failed(res, 'Find all keys error', keys.data);
      }
  
      return super.success(res, 'All keys', keys.data);
  }

  async update (req, res, next) {

    const { page = 1, limit = 10, ...filters } = req.query;
    const keys = await xApiKeyService.paginate(filters, page, limit);
    if (keys.error) {

        return super.failed(res, 'Find all keys error', keys.data);
    }

    return super.success(res, 'All keys', keys.data);
  }
}

module.exports = XApiKeyController.getInstance();
