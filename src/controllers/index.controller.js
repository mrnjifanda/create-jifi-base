const Controller = require('./controller');
const { configs } = require('../../configs/app.config');

class IndexController extends Controller {

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

    index (req, res, next) {

      return super.success(res, 'Welcom', configs.getAppInfo());
    }
}

module.exports = IndexController.getInstance();
