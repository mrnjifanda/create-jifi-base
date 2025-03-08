/***************************************************************************************************************************************************************************************
 * NOTE: If you want to put a global middleware, that is to say that applies to all routes, you must directly place it on the path '/' and automatically, it will be applied everywhere.
 ***************************************************************************************************************************************************************************************/

const { xApiKey } = require("./utils/middlewares/app.middleware");
const { isLogin, isAdmin } = require('./utils/middlewares/auth/auth.middleware');

const routes = [
    { path: '/welcom', route: 'index', middlewares: [ xApiKey ] },
    { path: '/auth', route: 'auth/auth', middlewares: [ xApiKey ] },

    { path: '/admin/logs', route: 'admin/logs', middlewares: [ xApiKey, isLogin , isAdmin ] },
    { path: '/admin/x-api-key', route: 'admin/x-api-key', middlewares: [ xApiKey, isLogin , isAdmin ] }
];

module.exports = routes;
