const { router } = require('../../configs/app.config');

const authController = require('../../src/controllers/auth/auth.controller');
const authValidation = require('../../utils/validations/auth.validation');

router.post('/register', authValidation.register, authController.register);
router.post('/activate-account', authValidation.activate_account, authController.activate_account);
router.post('/login', authValidation.login, authController.login);

module.exports = router;