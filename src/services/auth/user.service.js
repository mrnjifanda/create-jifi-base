const BaseService = require("../../../utils/bases/base.service");
const User = require("../../models/auth/user.model");

class UserService extends BaseService {

    static instance;
    constructor() {
        if (UserService.instance) return UserService.instance;
        super(User);
        UserService.instance = this;
    }

    /**
     * @returns { UserService }
     */
    static getInstance() {
        if (!UserService.instance) UserService.instance = new UserService();
        return UserService.instance;
    }
}

module.exports = UserService.getInstance();
