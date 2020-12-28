const ProjectController = require('./controllers/projects.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;

exports.routesConfig = function (app) {
    app.post('/projects', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        ProjectController.insert
    ]);
    app.get('/projects', [
        ProjectController.list
    ]);
    app.get('/searchprojects/:search', ProjectController.newSearch);
    app.get('/projects/:projectId', [
        ProjectController.getById
    ]);
    app.patch('/projects/:projectId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        ProjectController.updateProject
    ]);
    app.delete('/projects/:projectId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        ProjectController.removeById
    ]);
};
