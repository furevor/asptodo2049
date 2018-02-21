var ObjectID = require('mongodb').ObjectID;
var request = require('request');

function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}


module.exports = function(app, db) {

	//app.get('*/', function(req, res) {
	//  res.sendFile(path.join(__dirname + '/public/index.html'));
	//});*/


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
	 
	 
	var secretstring = "";

    app.get('/', (req, res) => {

        if(req.query.code != undefined && req.query.state != undefined) {
            if(req.query.state == "lunartemple2112")
            {
                secretstring = req.query.code;
                console.log("success!!");

                var bodyData = {
                    client_id: '5b2714d62ded4a8dbc11cd22cdb5cb87',
					client_secret: '1d8df6f955344f6f86b299d88a91b0cc',
					code: secretstring,
					redirect_uri: 'https://asptodo-2049.herokuapp.com/'
                }

				res.send('{' + updateClient(bodyData) + '}');

                
            }
        }
        else
        {
            console.log('heheheh');
        }


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
        return request(clientServerOptions, function (error, response) {
            console.log(error, response.body);
            return response.body;
        });
    } 

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