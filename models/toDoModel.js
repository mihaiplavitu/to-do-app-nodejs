var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var toDoSchema = new Schema({
    username: String,
    toDo: String,
    isDone: Boolean,
    hasAttachment: Boolean
});

var ToDos = mongoose.model('ToDos', toDoSchema);
module.exports = ToDos;
