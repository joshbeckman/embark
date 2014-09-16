var passport = require('passport')
  , Account = require('../models/account')
  , fs = require('fs')
  , LocalStrategy = require('passport-local').Strategy
  , config = JSON.parse(fs.readFileSync('./static/config.json'));

passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// passport.use(
//   new TwitterStrategy({
//     consumerKey: process.env.TWITTER_CONSUMER_KEY || config.twitter.consumer_key,
//     consumerSecret: process.env.TWITTER_CONSUMER_SECRET || config.twitter.consumer_secret,
//     callbackURL: config.twitter.callbackURL,
//     passReqToCallback: true
//   },
//   function(req, token, tokenSecret, profile, done) {
//     User.findOne({email: profile.emails[0].value}, function(err, user) {
//       if(err){
//         console.log(err);
//         req.flash('error', 'There was a problem registering your account.');
//         return res.redirect('/');
//       }
//       if(user){
//         user.twitterToken = token;
//         user.twitterTokenSecret = tokenSecret;
//         user.twitterUid = profile.id;
//         user.provider = profile.provider;
//         user.twitterName = profile.displayName;
//         user.image = user.image || (profile.photos.length > 0 ? profile.photos[0].value : '');
//         user.save(function (err, savedUser, numberAffected) {
//           if (err) {
//             console.log(err);
//             req.flash('error', 'There was a problem saving account.');
//             return res.redirect('/');
//           }
//           return done(null, savedUser);
//         });
//       } else {
//         User.create({ email: profile.emails[0].value, 
//                       username: profile.displayName,
//                       twitterToken: token, 
//                       twitterTokenSecret: tokenSecret, 
//                       twitterUid: profile.id,
//                       twitterName: profile.displayName,
//                       provider: profile.provider,
//                       image: (profile.photos.length > 0 ? profile.photos[0].value : '')}, function(err, newUser) {
//           if (err) {
//             req.flash('error', 'There was a problem registering your account.');
//             return res.redirect('/');
//           }
//           return done(null, newUser);
//         });
//       }
//     });
//   }
// ));

// Simple route middleware to ensure user is authenticated. Otherwise send to login page.
exports.ensureAuth = function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  req.flash('error', 'Please log in.');
  res.redirect('/log-in');
};

exports.ensureApiAuth = function ensureApiAuth(req, res, next) {
  Account.findOne({key:req.query.key}).lean().exec(function(error,authAccount){
    if (authAccount || req.user) { return next(); }
    var error405 = {"error":{"code":405,"message":"Not allowed. You can't always get what you want."}};
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(error405));
    res.end();
  })
};

// Check for admin middleware, this is unrelated to passport.js
exports.ensureAdmin = function ensureAdmin(req, res, next) {
  return function(req, res, next) {
    console.log(req.user);
    if(req.user && req.user.admin === true)
      next();
    else
      res.send(403);
  }
};