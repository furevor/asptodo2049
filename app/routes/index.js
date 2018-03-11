const taskRoutes = require('./task_routes');
const importRoutes = require('./import_routes');
const config = require('../../config');

module.exports = function(app, db) {

    app.use(config.task_route, taskRoutes(db));

    app.use(config.import_route, importRoutes(app));

};