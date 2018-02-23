var ObjectID = require('mongodb').ObjectID;
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

    // метод выгружает из сервиса todoist заметки из указанного проекта
    app.get('/api/import/:pr_id', (req, res, next) => {

        console.log('hello from another here!!!');
        req.prID = req.params.pr_id;

        function callback(error, response, body) {
            console.log('hello from callback!!!');
            console.log(response.statusCode);

            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                //console.log(body);
                console.log('!!!!!!!!!!!!!END OF BODY!!!!!!!!!!');
                console.log(info);
            }
            res.myRandomMember = info;
            next();
        }
        console.log("Выводим токен");
        console.log(tempRes);

        var clientServerOptions = {
            uri: 'https://beta.todoist.com/API/v8/tasks',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer acc886eff36a46bd58aad5415a5e898143e93768'
            }
        }
        request(clientServerOptions, callback);

    }, (req, res) => {
        // определить массив и запушить туда просто через скобки объекты, если они удовлетворяют условиям.. хохохо..... ииииизи.
        var arr = [];
        for (var i = 0; i < res.myRandomMember.length; i++)
        {
            if(res.myRandomMember[i].project_id == req.prID)
            arr.push({heading: res.myRandomMember[i].content, priority: res.myRandomMember[i].priority, state: res.myRandomMember[i].completed});
        }
        res.send(arr);
    });




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
        console.log('Получен секретный код - ' + scode);

        
        var bodyData = {
            client_id: '5b2714d62ded4a8dbc11cd22cdb5cb87',
            client_secret: '1d8df6f955344f6f86b299d88a91b0cc',
            code: scode,
            redirect_uri: 'https://asptodo-2049.herokuapp.com/'
        }


        /*
        // temp test data
        var bodyData = {
            client_id: 'be8d40673d5e4d9d806c51991593f461',
            client_secret: '4658856170f0474f836123688e928471',
            code: scode,
            redirect_uri: 'https://asptodo-2049.herokuapp.com/'
        }
        */

        var clientServerOptions = {
            uri: 'https://todoist.com/oauth/access_token',
            body: JSON.stringify(bodyData),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        request(clientServerOptions, function (error, response) {
            console.log('Ошибкама =( ' + error, response.body);

            if (!error && response.statusCode == 200) {
                tempRes = JSON.parse(response.body);
                // отсюда токен надобна брать...
                console.log(tempRes.access_token);
            }
            else {
                console.log('post | /api/access - ' + response.statusCode);

                // жутчайший костыль, если останется время, то поправлю... (нет)
                res.mySpookyVar = response.statusCode;
            }

            // важная строка!
            app.set('access_code', 'acc886eff36a46bd58aad5415a5e898143e93768');

            next();
            return;
        });


    }, (req, res) => {
        //res.sendStatus(res.mySpookyVar);
        res.sendStatus(200);
    });

    // Метод предназначен для получения списка проектов с сервера todoist!
    app.get('/api/import', (req, res, next) => {
        console.log('hello from here!!!');

        function callback(error, response, body) {
            console.log('hello from callback!!!');
            console.log(response.statusCode);

            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                //console.log(body);
                console.log('!!!!!!!!!!!!!END OF BODY!!!!!!!!!!');
                console.log(info.projects);
            }
            res.myRandomMember = info.projects;
            next();
        }
        console.log("Выводим токен");
        console.log(req.app.get('access_code'));
        request.post('https://todoist.com/api/v7/sync', {form:{token: 'acc886eff36a46bd58aad5415a5e898143e93768', sync_token: '*', resource_types: '["projects"]'}}, callback);
    }, (req, res) => {
        res.send(res.myRandomMember);
    });



};