const { router } = require('../configs/app.config');

const logsController = require('../src/controllers/logs.controller');
const authMiddleware = require('../utils/middlewares/auth/auth.middleware');

router.get('/filters', authMiddleware.loginAdmin, logsController.all);
router.get('/filters/:id', authMiddleware.loginAdmin, logsController.findById);
router.get('/filters/user/:id', authMiddleware.loginAdmin, logsController.findByUser);

module.exports = router;
