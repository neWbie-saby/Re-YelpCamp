var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	isAdmin: {type: Boolean, default: false},
	isNormUser : {canEditPost: {type: Boolean, default: false},
				  canDeletePost: {type: Boolean, default: false},
				  canCommentEdit: {type: Boolean, default: true},
				  canDelComment: {type: Boolean, default: true}}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);