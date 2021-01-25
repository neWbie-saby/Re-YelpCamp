var express = require('express');
var router = express.Router();
var Camp = require('../models/campgrounds');
var middleware = require('../middleware');

//INDEX (REST) ROUTE
router.get('/', function(req, res){
	//Get all Campgrounds from DB
	//console.log(req.user);
	Camp.find({}, function(err, camps){
		if(err){
			console.log(err);
		}
		else{
			res.render('camps/index', {campgrounds: camps, currentUser: req.user});
		}
	});	
});

//NEW (REST) ROUTE
router.get('/new', middleware.isLoggedIn, middleware.canEditPost, function(req, res){
	// console.log(req.user.isNormUser);
	res.render('camps/new');
})

//CREATE (REST) ROUTE
router.post('/', middleware.isLoggedIn, middleware.canEditPost, function(req, res){
	var name = req.body.campname;
	var img = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCamp = {name: name, image: img, description: desc, author: author, price: price};
	// console.log(req.user);
	//Create a new Campground and save into DB
	Camp.create(newCamp, function(err, created){
		if(err){
			console.log(err);
		}
		else{
			//redirect to the main campgrounds page
			console.log(created);
			res.redirect('/campgrounds'); //inherently routes back to GET Route
		}
	});	
});

//SHOW (REST) ROUTE
router.get('/:id', function(req, res){
	//find campground with the ID
	Camp.findById(req.params.id).populate('comments').exec(function(err, faund){
		if(err || !faund){
			console.log(err);
			req.flash('error', 'No such Campground present');
			res.redirect('/campgrounds');
		}
		//render the show template 
		else{
			res.render('camps/show', {camp: faund});
		}
	});
});

//EDIT ROUTE
router.get('/:id/edit', middleware.canEditPost, middleware.checkAuthor, function(req, res){
	Camp.findById(req.params.id, function(err, toEdit){
		res.render('camps/edit', {camp: toEdit});
	});
});

//UPDATE ROUTE
router.put('/:id', middleware.canEditPost, middleware.checkAuthor, function(req, res){
	Camp.findByIdAndUpdate(req.params.id, req.body.edited, function(err, Updated){
		if(err){
			console.log(err);
			res.redirect('/campgrounds');
		}
		else{
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

//DESTROY ROUTE
router.delete('/:id', middleware.canDeletePost, middleware.checkAuthor, function(req, res){
	Camp.findById(req.params.id, function(err, deletedCamp){
		if(err){
			console.log(err);
			res.redirect('/campgrounds');
		}
		else{
			deletedCamp.remove();
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router;