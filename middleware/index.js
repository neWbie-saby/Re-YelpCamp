var Camp = require('../models/campgrounds');
var Comment = require('../models/comment');
var User = require('../models/user');
// All middleware goes HERE
var middlewareObj = {};

middlewareObj.checkAdmin = function(req, res, next){
	if(req.isAuthenticated()){
		User.findById(req.user._id, function(err, admin){
			if(err || !admin){
				req.flash('error', 'User not found');
				res.redirect('/campgrounds');
			}
			else{
				if(admin.isAdmin == true)
					next();
				else{
					req.flash('error', "You're not an Admin");
					res.redirect('/campgrounds');
				}
			}
		});
	}
	else{
		req.flash('error', 'You need to be logged in, again :(');
		res.redirect('/campgrounds');
	}
}

middlewareObj.checkAuthor = function(req, res, next){
	if(req.isAuthenticated()){
		Camp.findById(req.params.id, function(err, toWork){
			if(err || !toWork){
				req.flash('error', 'Campground not found');
				res.redirect('back');
			}
			else{
				if(toWork.author.id.equals(req.user._id)){
					next();
				}
				else if(req.user.isAdmin == true){
					next();
				}
				else{
					req.flash('error', "You don't have ownership");
					res.redirect('/campgrounds');
				}
			}
		});
	}
	else{
		req.flash('error', 'You need to be logged in, again :(');
		res.redirect('/campgrounds');
	}
}

middlewareObj.checkCommentAuthor = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, toWork){
			if(err || !toWork){
				req.flash('error', 'Comment not found');
				res.redirect('back');
			}
			else{
				if(toWork.author.id.equals(req.user._id)){
					next();
				}
				else if(req.user.isAdmin){
					next();
				}
				else{
					res.redirect('back');
				}
			}
		});
	}
	else{
		req.flash('error', 'You need to be logged in!');
		res.redirect('back');
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated())
		return next();
	req.flash('error', 'Log In First!!');
	res.redirect('/login');
}

middlewareObj.canEditPost = function(req, res, next){
	if(req.isAuthenticated()){
		User.findById(req.user._id, function(err, found){
			if(err || !found){
				req.flash('error', 'User not found');
				res.redirect('/campgrounds');
			}
			else{
				if(found.isNormUser.canEditPost == true || found.isAdmin == true)
					next();
				else{
					req.flash('error', "You cannot create or edit posts, ask Admin for permit");
					res.redirect('/campgrounds');
				}
			}
		});
	}
}

middlewareObj.canDeletePost = function(req, res, next){
	if(req.isAuthenticated()){
		User.findById(req.user._id, function(err, found){
			if(err || !found){
				req.flash('error', 'User not found');
				res.redirect('/campgrounds');
			}
			else{
				if(found.isNormUser.canDeletePost == true || found.isAdmin == true)
					next();
				else{
					req.flash('error', "You cannot delete posts, ask Admin for permit");
					res.redirect('/campgrounds');
				}
			}
		});
	}
}

middlewareObj.canCommentEdit = function(req, res, next){
	if(req.isAuthenticated()){
		User.findById(req.user._id, function(err, found){
			if(err || !found){
				req.flash('error', 'User not found');
				res.redirect('/campgrounds');
			}
			else{
				if(found.isNormUser.canCommentEdit == true || found.isAdmin == true)
					next();
				else{
					req.flash('error', "You cannot create or edit comments, ask Admin for permit");
					res.redirect('/campgrounds');
				}
			}
		});
	}
}

middlewareObj.canDelComment = function(req, res, next){
	if(req.isAuthenticated()){
		User.findById(req.user._id, function(err, found){
			if(err || !found){
				req.flash('error', 'User not found');
				res.redirect('/campgrounds');
			}
			else{
				if(found.isNormUser.canDelComment == true || found.isAdmin == true)
					next();
				else{
					req.flash('error', "You cannot delete comments, ask Admin for permit");
					res.redirect('/campgrounds');
				}
			}
		});
	}
}

middlewareObj.onToTrue = function(ar){
	if(ar === undefined)
			ar = {};
		
	if(ar.isAdmin === undefined)
		ar.isAdmin = false;
	else
		ar.isAdmin = (ar.isAdmin) === 'on' ? true : false;
		
	if(ar.isNormUser === undefined)
		ar.isNormUser = {};
		
	if(ar.isNormUser.canEditPost === undefined)
		ar.isNormUser.canEditPost = false;
	else
		ar.isNormUser.canEditPost = (ar.isNormUser.canEditPost) === 'on' ? true : false;
		
	if(ar.isNormUser.canDeletePost === undefined)
		ar.isNormUser.canDeletePost	= false;
	else
		ar.isNormUser.canDeletePost = (ar.isNormUser.canDeletePost) === 'on' ? true : false;
		
	if(ar.isNormUser.canCommentEdit === undefined)
		ar.isNormUser.canCommentEdit = false;
	else
		ar.isNormUser.canCommentEdit = (ar.isNormUser.canCommentEdit) === 'on' ? true : false;
		
	if(ar.isNormUser.canDelComment === undefined)
		ar.isNormUser.canDelComment = false;
	else
		ar.isNormUser.canDelComment = (ar.isNormUser.canDelComment) === 'on' ? true : false;
	
	return ar;
}

module.exports = middlewareObj;