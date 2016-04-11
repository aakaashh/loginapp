var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var UserModel = mongoose.model('UserModel');


router.post('/', function(req, res){
	console.log(req.body);
	var new_user = new UserModel({
		username: req.body.name,
		password: req.body.password
	});
	new_user.save(function(err, user_data){
		if(err) console.log(err);
		res.json(user_data);
	});
});

router.get('/:username/:password', function(req, res){
	console.log(req.params);
	UserModel.findOne({ username: req.params.username}, function(err, user_data){
		if(err){
			console.log(err);
		}else{
			if(user_data === null){
				res.json({username: null, error: "Username doesn't exist"});
			}else{
				if(user_data.password === req.params.password){
					res.json({username: req.params.username});
				}else{
					res.json({username: null, error: 'Incorrect password'});
				}
			}
		}
	});
});

module.exports = router;
