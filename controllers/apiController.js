var ToDos = require('../models/toDoModel.js');
var bodyParser = require('body-parser');

module.exports = function(app) {

    app.use(bodyParser.json()); // all my requests will be passed through my middelware first
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    function ensureAuthenticated (req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        } else {
            res.status(403).end(); // we reject the request if not authenticated
        };
    };

    app.get('/api/todos', ensureAuthenticated, function(req, res) {
        // find all ToDos for authenticated user using .find() method from mongoose module
        ToDos.find({
            username: req.user.username // req.user object is retrived from the session cookie
        }, function(err, toDosResults) {
            if (err) throw err;
            res.send(toDosResults);
        });
    });

    app.post('/api/todo', ensureAuthenticated, function(req, res) {
        // we update or save new ToDo
        // first we find out if we need to update or save a new one
        if (req.body.id) {
            // update specific ToDo using .findByIdAndUpdate() method from mongoose
            ToDos.findOneAndUpdate({ _id: req.body.id, username: req.user.username },
                {
                    toDo: req.body.toDo,
                    isDone: req.body.isDone,
                    hasAttachment: req.body.hasAttachment
                },
                {
                    new: true
                },
                function(err, toDoFindResult) {
                    if (err) throw err;
                    res.send(
                        {
                            "status": "ok",
                            "code": 200,
                            "message": [toDoFindResult]
                        }
                    );
            });
        } else {
            // if we didn't find the ID from the body of the request, it means it's a new ToDo and we create it
            var newTodo = ToDos({
                username: req.user.username, // req.user obj is retrived from session cookie
                toDo: req.body.toDo,
                isDone: req.body.isDone,
                hasAttachment: req.body.hasAttachment
            });

            // then we save the new ToDo in the dadabase
            newTodo.save(function(err, doc) {
                if (err) throw err;
                res.send(
                    {
                        "status": "ok",
                        "code": 200,
                        "message": doc
                    }
                );
            })
        };
    });

    app.delete('/api/todo', ensureAuthenticated, function(req, res) {
        // we find and remove a specific ToDo using findByIdAndRemove() method form mongoose
        ToDos.deleteOne({_id: req.body.id, username: req.user.username}, function(err) {
            if (err) throw err;
            res.send({
                "status": "ok",
                "code": 200,
                "message": [ 'document deleted: ' +  JSON.stringify(req.body) ]
            });
        })
    });
};
