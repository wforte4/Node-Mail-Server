const ThoughtController = require('./controllers/tasks.controller');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');

exports.routesConfig = function (app) {
    app.post('/tasks', [
        ValidationMiddleware.validJWTNeeded,
        ThoughtController.insert
    ]);
    app.get('/tasks', [
        ValidationMiddleware.validJWTNeeded,
        ThoughtController.list
    ]);
    app.delete('/tasks/:thoughtID', [
        ValidationMiddleware.validJWTNeeded,
        ThoughtController.removeById
    ]);
};
