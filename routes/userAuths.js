var express = require('express');
var router = express.Router();
var User = require('../models/user');
var middleware = require('../middleware');

router.get('/', middleware.checkAdmin, function(req, res){
	User.find({}, function(err, users){
		if(err){
			console.log(err);
		}
		else{
			res.render('users/list', {userList: users});
		}
	});
});
// USER AUTH EDIT ROUTE
router.get('/:id/edit',  middleware.checkAdmin, function(req, res){
	User.findById(req.params.id, function(err, user){
		res.render('users/edit', {user: user});
	});
});
// USER AUTH UPDATE ROUTE
router.put('/:id', middleware.checkAdmin, function(req, res){
	var ar = middleware.onToTrue(req.body.edited);
	User.updateMany({ _id: req.params.id}, ar, function(err, updated){
		if(err){
			console.log(err);
			req.flash('error', 'Could not update the permissions');
			res.redirect('/campgrounds');
		}
		else{
			// eval(require('locus'));
			req.flash('success', 'Updated the user permissions!');
			res.redirect('/list');
		}
	});
});
// USER DELETE ROUTE
router.delete('/:id', middleware.checkAdmin, function(req, res){
	User.findById(req.params.id, function(err, deletedUser){
		if(err){
			console.log(err);
			res.redirect('/list');
		}
		else{
			deletedUser.remove();
			req.flash('success', 'Deleted the user');
			res.redirect('/list');
		}
	});
});

module.exports = router;