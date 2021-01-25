var exp = require('express'),
	app = exp(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	Camp = require('./models/campgrounds'),
	Comment = require('./models/comment'),
	User = require('./models/user'),
	flash = require('connect-flash'),
	seedDB = require('./seeds_min'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override');

var campRoutes = require('./routes/campgrounds'),
	commentRoutes = require('./routes/comments'),
	indexRoutes = require('./routes/index'),
	userAuthRoutes = require('./routes/userAuths');
	
// seedDB();

var url = process.env.DATABASEURL;
// mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});

mongoose.connect(url, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(exp.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: 'Asche bochor abar hobe',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

//SCHEMA SETUP (done in models directory)

// ======================
// AUTH ROUTES
app.use('/', indexRoutes);
// ======================

// ======================
// ADMIN DASHBOARD ROUTES
app.use('/list', userAuthRoutes);
// ======================

// ======================
// PAGE ROUTES
app.use('/campgrounds', campRoutes);
// ======================

// ======================
// COMMENTS ROUTES
app.use('/campgrounds/:id/comments', commentRoutes);
// ======================

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log('YelpCamp s12 started...');
});