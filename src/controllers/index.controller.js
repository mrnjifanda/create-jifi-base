const BaseController = require('../../utils/bases/base.controller');
const { configs } = require('../../configs/app.config');

class IndexController extends BaseController {

    static instance;
    constructor() {

      if (IndexController.instance) return IndexController.instance;

      super();
      IndexController.instance = this;
    }

    /**
     * @returns { IndexController }
     */
    static getInstance() {

      if (!IndexController.instance) IndexController.instance = new IndexController();

      return IndexController.instance;
    }

    welcom (req, res, next) {

      return super.success(res, 'Welcom', configs.getAppInfo());
    }
}

module.exports = IndexController.getInstance();
