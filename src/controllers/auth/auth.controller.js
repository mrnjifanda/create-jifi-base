const BaseController = require('../../../utils/bases/base.controller');
const authService = require('../../services/auth/auth.service');

class AuthController extends BaseController {

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

        const response = await authService.register(req.body);
        if (response.error) return super.failed(res, response.message);
    
        const data = response.data;
        return super.success(res, 'User created successfully', { otp: data.otp, email: data.user.email }, 201);
    };
    
    async activate_account (req, res, next) {
    
        const data = await authService.activateAccount(req.body);
        if (data.error) return super.failed(res, data.message);
    
        return super.success(res, 'Account successfully activated');
    };
    
    async login (req, res, next) {

        const data = await authService.login(req.body, true, req.login_history);
        if (data.error) return super.failed(res, 'The username and password you entered do not match any accounts on record');
    
        return super.success(res, 'Connection completed successfully', data.data);
    };

    async isLogin (req, res, next) {

      return super.success(res, 'Authenticated User',{
          email: req.auth.email,
          role: req.auth.role
      });
    };

    async refresh_token (req, res, next) {

      const refresh = await authService.refresh_token(req.body.email, req.body.code, true);

      console.log(refresh);

      if (refresh.error) return super.unauthorized(res, refresh.message || 'Invalid token');

      return super.success(res, 'Token refresh successful', { token: refresh.data });
    };

    async forgot_password (req, res, next) {

        authService.forgotPassword(req.body.email);
        super.success(res, 'Instructions to reset your password have been sent to you by email.', null, 202);
    }

    async verify_otp (req, res, next) {

        const { email, code } = req.body;
        const data = await authService.verifyOtp(email, code);
        if (data.error) return super.failed(res, data.message);

        return super.success(res, data.message);
    }

    async resetPassword (req, res, next) {

      const { code, email, password }  = req.body;
      const data = await authService.resetPassword(code, email, password);
      if (data.error) return super.failed(res, data.message);

      return super.success(res, 'Password reset successfully');
    }
}

module.exports = AuthController.getInstance();
