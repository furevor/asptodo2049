var ObjectID = require('mongodb').ObjectID;
var moment = require('moment');

var express = require('express');
var router = express.Router();

module.exports = function (db) {


    router.get('/', (req, res) => {

        // получаем задачи из базы в виде массива
        var cursor = db.collection('angulartasks').find().toArray((err, item) => {
            res.send(item);
            return item;
        });

    });

    router.post('/', (req, res) => {

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

        db.collection('angulartasks').insert(arrData, (err, result) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {

                res.send(result.ops[0]);
            }
        });

    });


    //метод, что призван отдавать note по id!!
    router.get('/:id', (req, res) => {

        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};


        db.collection('angulartasks').findOne(details, (err, item) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                res.send(item);
            }
        });
    });

    router.delete('/:id', (req, res) => {

        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};

        db.collection('angulartasks').remove(details, (err, item) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                res.send('{Note ' + id + ' deleted!}');
            }
        });
    });

    // маршрут вызывается для сохранения отредактированной задачи на сервере
    router.put('/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        const note = {
            heading: req.body.heading,
            priority: req.body.priority,
            completed: req.body.completed,
            noteDate: req.body.noteDate
        };
        console.log(req.body);
        db.collection('angulartasks').update(details, note, (err, result) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                res.sendStatus(200);
            }
        });
    });

    return router;

};