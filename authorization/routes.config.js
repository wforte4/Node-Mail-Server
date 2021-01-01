const VerifyUserMiddleware = require('./middlewares/verify.user.middleware');
const AuthorizationController = require('./controllers/authorization.controller');
const AuthValidation = require('../common/middlewares/auth.validation.middleware');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;

exports.routesConfig = function (app) {

    app.post('/auth', [
        VerifyUserMiddleware.hasAuthValidFields,
        VerifyUserMiddleware.isPasswordAndUserMatch,
        AuthorizationController.login
    ]);

    app.post('/auth/refresh', [
        AuthValidation.validJWTNeeded,
        AuthValidation.verifyRefreshBodyField,
        AuthValidation.validRefreshNeeded,
        AuthorizationController.login
    ]);

    app.get('/auth/admin', [
        AuthValidation.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        AuthorizationController.checkAuthStatus
    ])
};