var ObjectID = require('mongodb').ObjectID;
var http = require('http');
var request = require('request');

module.exports = function(app, db) {

    app.get('/api/tasks', (req, res) => {

        const id = '5a851af3d071fe03aca92e36';//req.params.id;
        const details = { '_id': new ObjectID(id) };


        var arr = [{ _id: '12', heading: 'second note.. in process..', priority: 1, state: false }];

        // выглядит как суровая заплатка костыль...
        var cursor = db.collection('angulartasks').find().toArray((err, item) => {
            //console.log('test it');
            //console.log(item);
            res.send(item);
            return item;
        });

        /*
        cursor.each((err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                arr.push(item);
                //res.send(item);
            }
        });
        */
        //console.log(cursor);
        //console.log('curs is here');
        //res.send(cursor);

    });

    var secretstring = "";
    var tempRes = "";

    app.get('/', (req, res) => {
    /*
        if(req.query.code != undefined && req.query.state != undefined) {
            if(req.query.state == "lunartemple2112")
            {
                secretstring = req.query.code;
                console.log("success!!");


                var bodyTest = {
                    heading: 'some text.. please...',
                    priority: 0,
                    state: false,
                }

                var bodyData = {
                    client_id: '5b2714d62ded4a8dbc11cd22cdb5cb87',
                    client_secret: '1d8df6f955344f6f86b299d88a91b0cc',
                    code: secretstring,
                    redirect_uri: 'https://asptodo-2049.herokuapp.com/'
                }

                updateClient(bodyData, res);
                //res.send('{' + tempRes + '}');
                console.log('some assy fucking sheet...' + tempRes);
                //res.send(tempRes);
            }
        }
        else
        {
            console.log('heheheh');
        }

    */
    });


    function updateClient(postData){
        var clientServerOptions = {
            uri: 'https://todoist.com/oauth/access_token',
            body: JSON.stringify(postData),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        request(clientServerOptions, function (error, response) {
            console.log(error, response.body);

            tempRes = JSON.parse(response.body);
            console.log(tempRes.access_token);

            return;
        });


    }

    /*
    //метод, что призван отдавать note по id!!
    app.get('/api/tasks/:id', (req, res) => {

        //const id = '5a851af3d071fe03aca92e36';
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };


        db.collection('angulartasks').findOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(item);
            }
        });
    });
     */

    app.delete('/api/tasks/:id', (req, res) => {

        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };

        db.collection('angulartasks').remove(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send('{Note ' + id + ' deleted!}');
            }
        });
    });

    app.post('/api/tasks', (req, res) => {
        const note = { heading: req.body.heading, priority: req.body.priority, state: req.body.state };
        console.log(req.body);
        db.collection('angulartasks').insert(note, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result.ops[0]);
            }
        });
    });

    app.put('/api/tasks/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        const note = { heading: req.body.heading, priority: req.body.priority, state: req.body.state };
        db.collection('angulartasks').update(details, note, (err, result) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.sendStatus(200);
                //res.send(note);
            }
        });
    });



    app.post('/api/access', (req, res, next) => {

        var scode = req.body.secretCode;

        var bodyData = {
            client_id: '5b2714d62ded4a8dbc11cd22cdb5cb87',
            client_secret: '1d8df6f955344f6f86b299d88a91b0cc',
            code: scode,
            redirect_uri: 'https://asptodo-2049.herokuapp.com/'
        }

        var clientServerOptions = {
            uri: 'https://todoist.com/oauth/access_token',
            body: JSON.stringify(bodyData),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        request(clientServerOptions, function (error, response) {
            console.log(error, response.body);

            tempRes = JSON.parse(response.body);
            console.log(tempRes.access_token);
            // по идее нужно добавить условие, чтобы отправлять разлинчые статусы в случае успеха или нет!!!!!
            // всегда будет возвращаться 200...
            next();
            return;
        });


    }, (req, res) => {
        res.sendStatus(200);
    });


    app.get('/api/import', (req, res, next) => {
        console.log('hello from here!!!');
        var options = {
            url: 'https://todoist.com/api/v7/sync',
            headers: {
                'token': 'acc886eff36a46bd58aad5415a5e898143e93768',
                'sync_token': '*',
                'resource_types': '["projects"]'

            }
        };

        function callback(error, response, body) {
            console.log('hello from callback!!!');
            console.log(response.statusCode);

            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                console.log(info.stargazers_count + " Stars");
                console.log(info.forks_count + " Forks");
            }
            res.myRandomMember = response.statusCode;
            next();
        }

        request(options, callback);
    }, (req, res) => {
        res.sendStatus(res.myRandomMember);
    });



};