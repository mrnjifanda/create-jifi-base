const { router } = require('../configs/app.config');

const indexController = require('../src/controllers/index.controller');

router.get('/', indexController.welcom);

module.exports = router;
