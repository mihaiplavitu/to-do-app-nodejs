var ToDos = require('../models/toDoModel.js');

module.exports = function(app) {

    app.get('/api/setupTodos', function(req, res) {
        var setupTodos = [{
                username: 'Mihai',
                toDo: 'buy milk',
                isDone: false,
                hasAttachment: false
            },
            {
                username: 'Mihai',
                toDo: 'buy eggs',
                isDone: false,
                hasAttachment: false
            },
            {
                username: 'Mihai',
                toDo: 'buy water',
                isDone: false,
                hasAttachment: false
            },
            {
                username: 'Mihai',
                toDo: 'buy tomatos',
                isDone: false,
                hasAttachment: false
            }
        ];

        ToDos.create(setupTodos, function(err, results) {
            res.send(results);
        });
    });

};
