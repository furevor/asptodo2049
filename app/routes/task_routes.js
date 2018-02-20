var ObjectID = require('mongodb').ObjectID;


function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}


module.exports = function(app, db) {

	app.get('*/', function(req, res) {
	  res.sendFile(path.join(__dirname + '/public/index.html'));
	});


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



        //var jsonArray1 = [{ _id: '13', heading: 'third is just planing...', priority: 1, state: false }, { _id: '12', heading: 'second note.. in process..', priority: 1, state: false }];
        //var jsonArray2 = [{ _id: '12', heading: 'second note.. in process..', priority: 1, state: false }];


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
};

// 5a80ffa17e6f9c220c09097c