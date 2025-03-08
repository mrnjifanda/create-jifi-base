const { response } = require("../../../configs/app.config");
const authService = require("../../../src/services/auth/auth.service");

const getUser = async (req) => {

    const auth = req.header('Authorization');
    const token = auth && auth.split(' ')[1];
    
    if (!token) return { error: true, message: 'Authorization key not found' };

    const verified = authService.tokenVerify(token);
    if (!verified) return { error: true, message: 'Incorrect token' };

    const user = await authService.findOne({ user: verified.id }, { select: 'role', populate: [ { path: 'user', select: 'last_name first_name username email' } ] });
    
    if (user.error || !user.data) return { error: true, message: 'User not found' };

    return { error: false, data: user.data };
};

const isLogin =  async (req, res, next) => {

    try {
        
        const user = await getUser(req);
        if (user.error) return response.unauthorized(res, next);
        
        req.auth = user.data.user;
        req.auth.role = user.data.role;
        next();
    } catch (error) {

        return response.unauthorized(res, next);
    }
}

const isAdmin =  async (req, res, next) => {

    try {

        const auth = req.auth;
        if (!auth || auth.role !== 'ADMIN') return response.forbidden(res, next, 'You are only authorized to access the content');

        next();
    } catch (error) {

        return response.forbidden(res, next, 'You are only authorized to access the content');
    }
}

module.exports = { isLogin, isAdmin };
