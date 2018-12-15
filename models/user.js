var mongoose = require('mongoose');
var bcrypt = require('bcryptjs'); // used to hash the password

// User Schema
var UserSchema = mongoose.Schema({
    name: String,
    username: {
        type: String,
        unique: true, // mongoDb will throw error code 11000 if it finds a duplicate
        index:true,
        dropDups: true,
        lowercase: true // convert to lowercase
    },
    email: {
        type: String,
        unique: true, // mongoDb will throw error code 11000 if it finds a duplicate
        index:true,
        dropDups: true,
        lowercase: true // convert to lowercase
    },
    password: String
});

var User = mongoose.model('User', UserSchema); // create a variable to expose it outside of this file to use this mongoose model
module.exports = User;

// user function to use when we create a new user
module.exports.createUser = function(newUser, callback) {
    // we hash our password
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in password DB.
            newUser.password = hash;
            newUser.save(callback);
    });
});
};

module.exports.getUserByUsername = function(username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback); // mongoose method to find doc in the database by id
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
};
