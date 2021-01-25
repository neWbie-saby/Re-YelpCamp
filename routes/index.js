var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var middleware = require('../middleware');
// var specialCode = "happyXmas";

//Root route
router.get('/', function(req, res){
	res.render('landing');
});
//Register route
router.get('/register', function(req, res){
	res.render('register');
});

//Handling Sign-up posts
router.post('/register', function(req, res){
	var newUser = new User({username: req.body.username});
	// if(req.body.adminCode === specialCode){
	// 	newUser.isAdmin = true;
	// }
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			// console.log(err);
			req.flash('error', err.message);
			// return res.render('register');
			res.redirect('/register');
		}
		passport.authenticate('local')(req, res, function(){
			req.flash('success', "Welcome to YeplCamp " + user.username);
			res.redirect('/campgrounds');
		});
	});
});

//Login form
router.get('/login', function(req, res){
	res.render('login');
});

//Login POST route
router.post('/login', passport.authenticate('local',
	{
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	}), function(req, res){
});

//Logout route
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'Logged out!!');
	res.redirect('/campgrounds');
});

module.exports = router;