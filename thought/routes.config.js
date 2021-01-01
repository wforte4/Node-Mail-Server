const ThoughtController = require('./controllers/tasks.controller');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');

exports.routesConfig = function (app) {
    app.post('/thoughts', [
        ValidationMiddleware.validJWTNeeded,
        ThoughtController.insert
    ]);
    app.get('/thoughts', [
        ValidationMiddleware.validJWTNeeded,
        ThoughtController.list
    ]);
    app.get('/thoughts/getbyemail/:email', [
        ValidationMiddleware.validJWTNeeded,
        ThoughtController.getByEmail
    ])
    app.delete('/thoughts/:thoughtID', [
        ValidationMiddleware.validJWTNeeded,
        ThoughtController.removeById
    ]);
};
