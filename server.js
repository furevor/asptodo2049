const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const app            = express();

const port = 8000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.static(__dirname + '/public'));

MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err);

    // небольшая заплатка в связи с использованием версии 3+
    const myAwesomeDB = database.db('tasks')


    require('./app/routes')(app, myAwesomeDB);
    var server = app.listen(process.env.PORT || 8080, () => {
		var port = server.address().port;
        console.log("App now running on port", port);
    });
});

