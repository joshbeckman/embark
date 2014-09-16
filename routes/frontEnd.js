
/*
 * Browser routing, for clients
 */
var fs = require('fs')
    , request = require('request')
    , config = JSON.parse(fs.readFileSync('./static/config.json'))
    , gadget = require('../lib/gadget')
    , Account = require('../models/account')
    , passport = require('passport')
    , newTime
    , response;

module.exports = function (app, ensureAuth, io) {
  app.get('/', function(req, res) {
    res.render('index', { title: config.name,
                          message: req.flash('message'), 
                          error: req.flash('error'),
                          user: req.user,
                          query: req.query
                        });
  });

  app.get('/register', function(req, res) {
    if(!req.user){
      res.render('register', { title: 'Register', 
                              user: req.user, 
                              message: req.flash('message'), 
                              error: req.flash('error') 
                            });
    } else {
      res.redirect('/'); 
    }
  });

  app.get('/confirm-account/:key', function(req, res) {
    Account.findOne({key: req.params.key}, function(err, account){
      if(err) {
        req.flash('error', 'There was a problem finding your account: '+err);
        res.redirect('/');
        console.log('err', err);
      } else {
        account.confirmed = true;
        account.save(function(err, saved){
          if(err) {
            req.flash('error', 'There was a problem confirming your email address: '+err)
            res.redirect('/');
            console.log('err', err);
          }
          req.flash('message', 'Email address confirmed!');
          res.redirect('/');
        });
      }
    });
  });

  app.post('/register', function(req, res) {
    Account.register(new Account({ email : req.body.username, username: req.body.username.match(/^[^@]*/) }), req.body.password, function(err, account) {
      if (err) {
        req.flash('error', 'That email is already in use.')
        return res.redirect('/register');
      }
      // Then redirect
      passport.authenticate('local')(req, res, function () {
        Account.sendConfirm(account);
        req.flash('message', 'Welcome, '+account.username+'! Check your inbox for a confirmation email.');
        res.redirect('/');
      });
    });
  });

  app.get('/log-in', function(req, res) {
    if (!req.user){
      res.render('login', { title: 'Log In', user: req.user, message: req.flash('message'), error: req.flash('error') });
    } else {
      res.redirect('/'); 
    }
  });

  app.post('/log-in', passport.authenticate('local', { failureRedirect: '/log-in', failureFlash: 'Invalid email or password.' }), function(req, res) {
    res.redirect('/');
  });

  app.get('/log-out', function(req, res) {
    req.logout();
    req.flash('message', 'You have been logged out.')
    res.redirect('/');
  });

  app.get('/account', ensureAuth, function(req, res){
    res.render('account', { title: 'Your Account Details', 
                              user: req.user, 
                              codedKey: req.user.key,
                              message: req.flash('message'), 
                              error: req.flash('error') 
                            });
  });

  app.post('/account', ensureAuth, function(req, res){
    if(!req.body.username || !req.body.email){
      req.flash('error', 'Please supply a username and email.')
      res.redirect('/account');
    } else {
      Account.findById(req.user._id, function(err, account){
        if(err){
          req.flash('error', 'Updates were unsuccessful: '+err);
          res.redirect('/account');
        }
        account.username = req.body.username;
        account.email = req.body.email;
        var oldEmail = account.email;
        if (oldEmail != req.body.email){
          account.confirmed = false;
        }
        account.save(function(err, saved){
          if(err) {
            req.flash('error', 'There was a problem in saving that information: '+err)
            res.redirect('/account');
            throw err;
          } else {
            if (oldEmail != req.body.email){
              req.flash('message', 'We sent a confirmation email for your new address.');
              Account.sendReConfirm(account);
            }
            req.flash('message', 'Updates were successful!');
            res.redirect('/account');
          }
        });
      });
    }
  });

};