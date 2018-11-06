var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();

mongoose = require('mongoose'),
Task = require('./api/models/todoListModel'), //created model loading here
Schema = require('./api/models/schemaModel'),

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://pi2:csstv2018@ds159187.mlab.com:59187/projectdb');
mongoose.connect('mongodb://localhost:27017/Tododb');

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Route for handling File updates.
var fileUpload = require('./api/routes/filesRoutes');
fileUpload(app);

var mail = require('./api/routes/mailsRoutes');
mail(app);

//var routes = require('./api/routes/todoListRoutes'); //importing route
var project_routes = require('./api/routes/projectRoutes');
project_routes(app); //register the route

var partner_routes = require('./api/routes/partnerRoutes');
partner_routes(app);

var major_routes = require('./api/routes/majorsRoutes');
major_routes(app);

var api_routes = require('./api/routes/adminRoutes');
api_routes(app);

var comments_routes = require('./api/routes/commentsRoute')
comments_routes(app);

app.use('/static', express.static('./.uploads'));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

//app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
