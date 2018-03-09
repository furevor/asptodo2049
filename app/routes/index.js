const taskRoutes = require('./task_routes');
const importRoutes = require('./import_routes');


module.exports = function(app, db) {

    app.use('/api/tasks', taskRoutes(db));

    app.use('/api/import', importRoutes);

};