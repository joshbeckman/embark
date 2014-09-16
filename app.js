require('newrelic');
var express = require('express')
  , app = express()
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , config = JSON.parse(fs.readFileSync('./static/config.json'))
  , pkg = JSON.parse(fs.readFileSync('./package.json'))
  , mongoUri = process.env.MONGOLAB_URI
              || process.env.MONGOHQ_URL
              || 'mongodb://localhost/embark'
  , mongoose = require('mongoose')
  , passport = require('passport')
  , pass = require('./config/passport')
  , flash = require('connect-flash')
  , LocalStrategy = require('passport-local').Strategy
  , io = require('socket.io')
  , Account = require('./models/account')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

// all environments
mongoose.connect(mongoUri);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.cookieSession({ secret: 'your even secreter phrase here', cookie: { maxAge: 1000*60*60*24*7 } })); // CHANGE THIS SECRET!
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
app.use(function(req, res, next){
  res.status(404);
  if (req.accepts('html')) {
    res.render('404', { url: req.url, title: '404 - '+config.name });
    return;
  }
  if (req.accepts('json')) {
    res.send(404, config.status['404']);
    return;
  }
  res.type('txt').send('404: Not found');
});
function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}
function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.send(500, config.status['500']);
  } else {
    next(err);
  }
}
function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

// development only
app.configure('development', function(){
  app.use(express.errorHandler({ showStack: true }));
  var repl = require('repl').start('liverepl> ');
  repl.context.io = io;
  repl.context.Account = Account;
});

// Set up routes
require('./routes/frontEnd')(app, pass.ensureAuth, io);
require('./routes/api')(app, pass.ensureApiAuth, io);
require('./routes/io')(app, io);

server.listen(app.get('port'), function(){
  console.log(config.name + " server listening on port %d in %s mode", app.get('port'), app.settings.env);
});
