var request = require('request');
var express = require('express');
var router = express.Router();


module.exports = function (app) {

    router.get('/clear', (req, res) => {

        tempRes = "";
        app.locals.accessCode = undefined;
        console.log("sector clear");
        res.sendStatus(200);

    });

// метод выгружает из сервиса todoist задачи из указанного проекта
    router.get('/:pr_id', (req, res, next) => {

        req.prID = req.params.pr_id;

        function callback(error, response, body) {

            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
            }
            res.myRandomMember = info;
            next();
        }

        var clientServerOptions = {
            uri: 'https://beta.todoist.com/API/v8/tasks',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + app.locals.accessCode
            }
        }
        if (app.locals.accessCode != undefined) {
            console.log("access token - " + app.locals.accessCode);
            request(clientServerOptions, callback);
        }
        else {
            console.log("access token - " + app.locals.accessCode);
            res.sendStatus(500);
        }


    }, (req, res) => {
        // отправляем, сохранённые задачи на сторону клиента
        var arr = [];
        for (var i = 0; i < res.myRandomMember.length; i++) {
            if (res.myRandomMember[i].project_id == req.prID) {

                var priority = 0;

                switch (res.myRandomMember[i].priority) {
                    case 4:
                        priority = 2;
                        break;
                    case 3:
                        priority = 2;
                        break;
                    case 2:
                        priority = 1;
                        break;
                    default:
                        priority = 0;
                }
                arr.push({
                    heading: res.myRandomMember[i].content,
                    priority: priority,
                    completed: res.myRandomMember[i].completed
                });
            }

        }
        res.send(arr);
    });


// Метод предназначен для получения списка проектов с сервера todoist!
    router.get('/', (req, res, next) => {

        function callback(error, response, body) {

            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
            }
            res.myRandomMember = info.projects;
            next();
        }

        request.post('https://todoist.com/api/v7/sync', {
            form: {
                token: app.locals.accessCode,
                sync_token: '*',
                resource_types: '["projects"]'
            }
        }, callback);
    }, (req, res) => {
        res.send(res.myRandomMember);
    });


// временно сохраним сюда access_token
    var tempRes = "";

// метод предназначен для обмена кода доступа на access_token
    router.post('/access', (req, res, next) => {

        var scode = req.body.secretCode;
        console.log('Получен секретный код!');

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
            console.log('Ошибкама =( ' + error, response.body);

            if (!error && response.statusCode == 200) {
                tempRes = JSON.parse(response.body);
            }
            else {
                // жутчайший костыль, если останется время, то поправлю... (нет)
                res.mySpookyVar = response.statusCode;
            }
            // важная строка! (не спрашивайте почему)
            app.locals.accessCode = tempRes.access_token;

            next();
            return;
        });

    }, (req, res) => {
        res.sendStatus(200);
        //res.sendStatus(res.mySpookyVar);
    });
    
    return router;

};