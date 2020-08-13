var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var bodyparser=require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var mongoose=require('mongoose');


//var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var employeeRouter=require('./routes/employeeRout');
//var employerRouter=require('./routes/employerRouter');

var app = express();

//mongo db server connection
mongoose.connect('mongodb://localhost/finalproject',{ useNewUrlParser: true ,useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connection established");
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
//Bodyparser
app.use(bodyparser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));
app.use(session({
  secret: 'optimusprime',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))


//app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/',employeeRouter);
//app.use('/employer',employerRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
