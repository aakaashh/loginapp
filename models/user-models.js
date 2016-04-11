var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	username: String,
    password: String
});

var UserModel = mongoose.model('UserModel', UserSchema);
