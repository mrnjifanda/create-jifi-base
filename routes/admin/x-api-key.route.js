const { router } = require('../../configs/app.config');

const xApiKeyController = require('../../src/controllers/admin/x-api-key.controller');

router.get('/find', xApiKeyController.find);
router.post('/create', xApiKeyController.create);
router.put('/update', xApiKeyController.update);

module.exports = router;
