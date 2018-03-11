var ObjectID = require('mongodb').ObjectID;
var moment = require('moment');
var config = require('../../config');

var express = require('express');
var router = express.Router();

// Alex Bazhenov Wrapper
// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
const asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };


module.exports = function (db) {

    router.get('/', asyncMiddleware(async function(req, res, next) {
        //console.log("Just should work, I hope...");
        var item = await db.collection(config.DBcollectionName).find().toArray();
        res.send(item);
    }));


    router.post('/', asyncMiddleware(async function(req, res, next) {

        var arrData = [];

        // проверяем, пришёл ли нам массив объектов, либо единичный объект
        if (Array.isArray(req.body)) {
            req.body.forEach((dataItem) => {
                arrData.push({
                    heading: dataItem.heading,
                    priority: dataItem.priority,
                    completed: dataItem.completed,
                    noteDate: moment(dataItem.noteDate).format("YYYY-MM-DD")
                });
            });
        }
        else {
            arrData.push({
                heading: req.body.heading,
                priority: req.body.priority,
                completed: req.body.completed,
                noteDate: moment(req.body.noteDate).format("YYYY-MM-DD")
            });
        }

        var result = await db.collection(config.DBcollectionName).insert(arrData);
        res.send(result.ops[0]);


    }));

    //метод, что призван отдавать note по id!!
    router.get('/:id', asyncMiddleware(async function(req, res, next) {

        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};

        var item = await db.collection(config.DBcollectionName).findOne(details);
        res.send(item);

    }));


    router.delete('/:id', asyncMiddleware(async function(req, res, next) {

        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};


        var result = await db.collection(config.DBcollectionName).remove(details);
        res.send('{Note ' + id + ' deleted!}');


    }));


    // маршрут вызывается для сохранения отредактированной задачи на сервере
    router.put('/:id', asyncMiddleware(async function(req, res, next) {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        const note = {
            heading: req.body.heading,
            priority: req.body.priority,
            completed: req.body.completed,
            noteDate: req.body.noteDate
        };
        console.log(req.body);
        await db.collection(config.DBcollectionName).update(details, note);
        res.sendStatus(200);

    }));


    router.use(function(err, req, res, next) {
        console.error(err);
        res.status(500).json({message: 'an error occurred'});
    });

    return router;

};