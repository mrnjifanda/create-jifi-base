const Controller = require('../controller');
const authService = require('../../services/auth/auth.service');

class AuthController extends Controller {

    static instance;
    constructor() {

      if (AuthController.instance) return AuthController.instance;

      super();
      AuthController.instance = this;
    }

    /**
     * @returns { AuthController }
     */
    static getInstance() {

      if (!AuthController.instance) AuthController.instance = new AuthController();

      return AuthController.instance;
    }

    async register (req, res, next) {

        const data = await authService.register(req.body);
        if (data.error) return super.failed(res, data.message);
    
        return super.success(res, 'User created successfully', data.data, 201);
    };
    
    async activate_account (req, res, next) {
    
        const data = await authService.activateAccount(req.body);
        if (data.error) return super.failed(res, data.message);
    
        return response.success(res, 'Account successfully activated');
    };
    
    async login (req, res, next) {
    
        const data = await authService.login(req.body, true);
        if (data.error) return super.failed(res, 'The username and password you entered do not match any accounts on record');
    
        return super.success(res, 'Connection completed successfully', data.data);
    };
}

module.exports = AuthController.getInstance();
