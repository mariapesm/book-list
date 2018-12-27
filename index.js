let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let passport = require('passport');
let path = require('path');
let favicon = require('serve-favicon');
let bookRouter = require('./routes/bookRouter');
let userRouter = require('./routes/userRouter');

// mongoose.connect('mongodb://localhost:27017/bookflow');
mongoose.connect(process.env.MONGODB_URI);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error'));
db.once('open', () => console.log('mongodb connected'));

let app = express();

app.set('port', process.env.PORT || 3001);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(passport.initialize());

// render index.html
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use(favicon(path.join(__dirname, 'client', 'build', 'favicon.ico')));

// use routes
app.use('/book', bookRouter);
app.use('/user', userRouter);

// handle errors
app.use(function(req, res, next){
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

if(app.get('env') === 'development'){
	app.use(function(err, req, res, next){
		res.status(err.status || 500)
		res.json({
			message: err.message,
			error: err
		});
	});
}

app.listen(app.get('port'), () => {
	console.log(`app running on port ${app.get('port')}`);
});
