var express = require('express');
var router = express.Router({mergeParams: true});
var Camp = require('../models/campgrounds');
var Comment = require('../models/comment');
var middleware = require('../middleware');

// COMMENT NEW(CREATE) ROUTE
router.get('/new', middleware.isLoggedIn, middleware.canCommentEdit, function(req, res){
	Camp.findById(req.params.id, function(err, ground){
		if(err)
			console.log(err);
		else
			res.render("comments/new", {camp: ground});
	});
});

// COMMENT POST ROUTE
router.post('/', middleware.isLoggedIn, middleware.canCommentEdit, function(req, res){
	Camp.findById(req.params.id, function(err, ground){
		if(err){
			console.log(err);
			res.redirect('/campgrounds');
		}
		else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}
				else{
					//add username and id to the comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// console.log(req.user.username);
					comment.save();
					ground.comments.push(comment);
					ground.save();
					// console.log(comment);
					res.redirect('/campgrounds/' + ground._id);
				}
			});
		}
	});
});

// COMMENT EDIT ROUTE
router.get('/:comment_id/edit', middleware.canCommentEdit, middleware.checkCommentAuthor, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err || !foundComment){
			res.redirect('back');
		}
		else{
			res.render('comments/edit', {comment: foundComment, camp_id: req.params.id});
		}
	});
});

// COMMENT UPDATE ROUTE
router.put('/:comment_id',  middleware.canCommentEdit, middleware.checkCommentAuthor, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, UpdatedComment){
		if(err){
			res.redirect('back');
		}
		else{
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

// COMMENT DESTROY ROUTE
router.delete('/:comment_id', middleware.checkCommentAuthor, middleware.canDelComment, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect('back');
		}
		else{
			req.flash('success', 'Comment deleted');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

module.exports = router;