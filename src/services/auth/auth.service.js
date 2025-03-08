const BaseService = require("../../../utils/bases/base.service");
const userService = require("./user.service");
const Auth = require("../../models/auth/auth.model");

class AuthService extends BaseService {

    static instance;
    constructor() {
        if (AuthService.instance) return AuthService.instance;
        super(Auth);
        AuthService.instance = this;
    }

    /**
     * @returns { AuthService }
     */
    static getInstance() {
        if (!AuthService.instance) AuthService.instance = new AuthService();
        return AuthService.instance;
    }

    generateOTP(token = { type: 'numeric', length: 6 }) {

        const keys = {
            numeric: '0123456789',
            alphabet: 'azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN'
        };

        const database = keys[token.type] ?? keys.alphabet;
        let result = '';
        for (let i = 0; i < token.length; i++) {

            result += database.charAt(Math.floor(Math.random() * database.length));
        }

        return result;
    }

    async login(data, active = false, login_history = {}) {

        let find_user = await userService.findOne({ email: new RegExp(data.email, 'i') }, { select: 'last_name, first_name, username, email, password' });
        if (find_user.error || !find_user.data) return { error: true, message: 'This account not found' };

        const user = find_user.data;
        const verify_password = await this.hashCompare(data.password, user.password); 
        if (!verify_password) return { error: true, message: 'Password does not match' };

        const find_auth = await super.findOne({ user: user._id }, { select: 'confirmed_at, role, login_history' });
        const auth = find_auth.data;
        if (active) {
            
            if ((find_auth.error || auth.confirmed_at === null)) return { error: true, message: 'Account is not yet activated' };
        }

        const token = super.token({ id: user._id }, '15m');
        const refresh_token = super.token({ id: user._id }, '7d');

        login_history.token = token;
        login_history.refresh_token = refresh_token;
        auth.login_history.push(login_history);
        auth.save();

        super.mail().sendWithQueue(data.email, 'New login to your account', 'auth/login', { user });
        return {
            error: false,
            data: {
                token,
                refresh_token,
                user: {
                    id: user._id,
                    last_name: user.last_name,
                    first_name: user.first_name,
                    username: user.username,
                    email: user.email,
                    role: auth.role ?? null
                }
            }
        };
    }

    async refresh_token(email, token, active = false) {

        const find_user = await userService.findOne({ email: new RegExp(email, 'i') }, { select: '_id' });
        if (find_user.error || !find_user.data) return { error: true, message: 'This account not found' };

        const user = find_user.data;
        const find_auth = await super.findOne({ user: user._id }, { select: 'confirmed_at, role, login_history' });
        const auth = find_auth.data;
        if (active) {
            
            if ((find_auth.error || auth.confirmed_at === null)) return { error: true, message: 'Account is not yet activated' };
        }

        const verification = super.tokenVerify(token);
        if (!verification || verification.id !== user._id.toString()) {

            return { error: true, message: 'Incorrect refresh token' };
        }

        const new_token = super.token({ id: user._id }, '15m');
        auth.login_history.token = new_token;
        auth.save();

        return { error: false, data: new_token };
    }

    async register(data, token = { type: 'numeric', length: 6 }) {

        const findUser = await userService.findOne({ email: new RegExp(data.email, 'i')});
        if (findUser.error || findUser.data) return { error: true, message: 'This email is already in use' };

        const password = await super.hash(data.password);
        const { role, last_name, first_name, username, email } = data;

        const user = await userService.create({ last_name, first_name, username, email, password });
        if (user.error) return user;

        const confirmation_token = this.generateOTP(token);
        const auth = await super.create({ user: user.data._id, passwords: [ password ], confirmation_token, role });
        if (auth.error) return auth;

        super.mail().sendWithQueue(email, 'OTP verification', 'auth/register-otp', { otp: confirmation_token });
        return {
            error: false,
            data: { otp: confirmation_token, user: user.data }
        };
    }

    async activateAccount(data) {

        const response = { error: true, message: 'This account not found' };
        const find_auth = await super.findOne({ confirmation_token: data.code }, {
            select: 'confirmation_token ,confirmed_at',
            populate: { path: 'user', select: 'email username' }
        });

        if (find_auth.error || !find_auth.data || !find_auth.data.user.email) return response;

        const auth = find_auth.data;

        if (data.email.toLowerCase() != auth.user.email.toLowerCase()) return response;

        auth.confirmation_token = null;
        auth.confirmed_at = new Date();
        await auth.save();

        super.mail().sendWithQueue(data.email, 'Account activation successful', 'auth/activation', { user: auth.user });
        return { error: false, message: 'Account activated successfully' };
    }

    async forgotPassword(email) {

        const findUser = await userService.findOne({ email: new RegExp(email, 'i')}, { select: '_id'});
        if (findUser.error || !findUser.data) return { error: true, message: 'This email is not registered' };

        const reset_password_token = this.generateOTP({ type: 'numeric', length: 10 });
        const update = await super.update({ user: findUser.data._id }, { reset_password_token });
        if (update.error) return { error: true, message: 'An error occurred, please try again later!!!' };

        super.mail().sendWithQueue(email, 'Reset password', 'auth/forgot-password', { token: reset_password_token });
        return { error: false, message: 'Reset password link sent to your email address' };
    }

    async verifyOtp(email, code) {

        const errorResponse = { error: true, message: 'Email or code not valide' };
        try {

            const find_auth = await super.findOne({ reset_password_token: code }, {
                select: 'passwords, confirmed_at, reset_password_token, reset_password_at',
                populate: { path: 'user', select: 'email password' }
            });
    
            const auth = find_auth.data;
            if (find_auth.error || auth.confirmed_at === null) return errorResponse;
    
            if (!auth.user.email || auth.user.email.toLowerCase() !== email.toLowerCase()) return errorResponse;
    
            return { error: false, message: 'OTP verification successful', data: auth };
        } catch (error) {
            return errorResponse;
        }
    }

    async resetPassword(code, email, password) {

        const verify = await this.verifyOtp(email, code);
        if (verify.error) return verify;

        const auth = verify.data;
        const hash = await super.hash(password);
        if (!hash) return { error: true, message: 'Invalid password' };

        const user = auth.user;
        auth.passwords.push(hash);
        auth.reset_password_token = null;
        auth.reset_password_at = new Date();
        user.password = hash;

        await auth.save();
        await user.save();

        return { error: true, message: 'Password reset successfully' };
    }
}

module.exports = AuthService.getInstance();
