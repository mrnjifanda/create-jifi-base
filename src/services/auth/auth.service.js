const BaseService = require("../base.service");
const User = require("../../models/user.model");

class AuthService extends BaseService {

    constructor() {

        super(User);
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

    async login(data, active = false) {

        let find_user = await super.findOne({ email: new RegExp(data.email, 'i') }, { select: 'last_name, first_name, username, email, password, role, confirmed_at' });
        if (find_user.error || !find_user.data) return { error: true, message: 'This account not found' };

        const user = find_user.data;
        const verify_password = await this.hashCompare(data.password, user.password); 
        if (!verify_password) return { error: true, message: 'Password does not match' };

        if (active && !user.confirmed_at) return { error: true, message: 'Account is not yet activated' }

        const token = super.token({ id: user._id});
        return {
            error: false,
            data: {
                token,
                user: {
                    id: user._id,
                    last_name: user.last_name,
                    first_name: user.first_name,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        };
    }

    async register(data, token = { type: 'numeric', length: 6 }) {

        const findUser = await super.findOne({ email: new RegExp(data.email, 'i')});
        if (findUser.error || findUser.data) return { error: true, message: 'This email is already in use' };

        const password = await super.hash(data.password);
        const confirmation_token = this.generateOTP(token);

        data.confirmation_token = confirmation_token;
        data.password = password;
        const user = await this.create(data);
        if (user.error) return user;

        return {
            error: user.error,
            data: { otp: confirmation_token, user: user.data }
        };
    }

    async activateAccount(data) {

        const response = { error: true, message: 'This account not found' };
        const where = { email: new RegExp(data.email, 'i'), confirmation_token: data.code };
        const find_user = await super.findOne(where);
        if (find_user.error || !find_user.data) return response;

        const update = await super.update(where, {
            confirmation_token: null,
            confirmed_at: new Date()
        });

        response.message = 'An error occurred, please try again later !!!';
        return update.error ? response : { error: false };
    }
}

module.exports = new AuthService();