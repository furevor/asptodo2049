var express = require('express');
var router = express.Router();
var rp = require('request-promise');

// Alex Bazhenov Wrapper
// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
const asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };

module.exports = function (app) {

    router.get('/clear', asyncMiddleware(async function(req, res, next) {

        tempRes = "";
        app.locals.accessCode = undefined;
        console.log("sector clear");
        res.sendStatus(200);

    }));

// метод выгружает из сервиса todoist задачи из указанного проекта
    router.get('/:pr_id', asyncMiddleware(async function(req, res, next) {

        //app.locals.accessCode = "acc886eff36a46bd58aad5415a5e898143e93768";
        req.prID = req.params.pr_id;

        var clientServerOptions = {
            uri: 'https://beta.todoist.com/API/v8/tasks',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + app.locals.accessCode
            }
        };


        if (app.locals.accessCode != undefined) {
            console.log("access token - " + app.locals.accessCode);
            var result = JSON.parse(await rp(clientServerOptions));
            res.send(prepareData(result));
        }
        else {
            console.log("access token - " + app.locals.accessCode);
            res.sendStatus(500);
        }

        // подготовка данных, предобработка статусов задачи (номера в todoist лежат в диапазоне [1;4]
        function prepareData(arr_) {
            var arr = [];
            for (var i = 0; i < arr_.length; i++) {
                if (arr_[i].project_id == req.prID) {

                    var priority = 0;

                    switch (arr_[i].priority) {
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
                        heading: arr_[i].content,
                        priority: priority,
                        completed: arr_[i].completed
                    });
                }

            }
            return arr;
        }

    }));


// Метод предназначен для получения списка проектов с сервера todoist!
    router.get('/', asyncMiddleware(async function(req, res, next) {

        //app.locals.accessCode = "acc886eff36a46bd58aad5415a5e898143e93768";

        var result = await rp.post('https://todoist.com/api/v7/sync', {
            form: {
                token: app.locals.accessCode,
                sync_token: '*',
                resource_types: '["projects"]'
            }
        });

        result = JSON.parse(result);

        res.send(result.projects);

    }));


// временно сохраним сюда access_token
    var tempRes = "";

// метод предназначен для обмена кода доступа на access_token
    router.post('/access', asyncMiddleware(async function(req, res, next) {

        var scode = req.body.secretCode;
        console.log('Получен секретный код! - ');

        var bodyData = {
            client_id: '5b2714d62ded4a8dbc11cd22cdb5cb87',
            client_secret: '1d8df6f955344f6f86b299d88a91b0cc',
            code: scode,
            redirect_uri: 'https://asptodo-2049.herokuapp.com/'
        };

        var clientServerOptions = {
            uri: 'https://todoist.com/oauth/access_token',
            body: JSON.stringify(bodyData),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        tempRes = JSON.parse(await rp(clientServerOptions));

        // важная строка!
        app.locals.accessCode = tempRes.access_token;
        res.sendStatus(200);

    }));

    return router;

};