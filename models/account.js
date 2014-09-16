/**
  * Account: A person, owning data
  *
  */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin,
    mail = require('../lib/mail');

var Account = new Schema({
    username: {type: String, default: ''},
    image: {type: String, default: ''},
    admin: { type: Boolean, default: false },
    confirmed: { type: Boolean, default: false },
    fullAccess: { type: Boolean, default: false },
    key: { type: String, default: ( Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2) ) },
    accessToken: String // Used for Remember Me
});

Account.plugin(passportLocalMongoose, {usernameField: 'email'});
Account.plugin(createdModifiedPlugin, {index: true});

Account.statics.generateRandomToken = function () {
  var user = this,
      chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
      token = new Date().getTime() + '_';
  for ( var x = 0; x < 16; x++ ) {
    var i = Math.floor( Math.random() * 62 );
    token += chars.charAt( i );
  }
  return token;
};

Account.statics.sendConfirm = function (acct) {
  var confirmOpt = {
      title: 'Did someone create an Embark account?',
      bodyElements: [
        "<img src='http://embark.co/images/favicon.png' style='display:block;max-width:400px;width:100%;margin:0 auto;'/>",
        "I think you did!",
        "Pretty please confirm your email address by clicking the big link below.",
        "We may need to send you super cool information about your <a href='http://embark.co'>Embark</a> account, and it's important that we have your actual email address.",
        "I'd also like to take a moment and welcome you to Embark.",
        "Welcome, and I hope you don't hesitate to suggest anything you would like to see Embark become. Just reply to this email and introduce yourself!"
      ],
      link: "http://www.embark.co/confirm-account/" + acct.key,
      linkCTA: "Confirm Your Email Address",
      linkColor: '#2c00f8',
      byline: "&mdash; <a href='http://twitter.com/jbckmn'>Josh</a> @ Embark",
      footerText: "Sent from ",
      footerLink: "http://embark.co?utm_source=email_footer",
      footerLinkText: "Embark"
    };
  mail({
    type: 'confirm',
    from: 'support@embark.co',
    to: acct.email,
    subject: 'Did someone create a Embark account?',
    tag: 'welcome',
    locals: confirmOpt
  }, function(err, success){
    if(success){
      console.log('sent confirmation email');
    }
  });
};

Account.statics.sendReConfirm = function (acct) {
  var confirmOpt = {
      title: 'Did you change your Embark account?',
      bodyElements: [
        "I think you did!",
        "Pretty please confirm your new email address by clicking the big link below."
      ],
      link: "http://www.embark.co/confirm-account/" + acct.key,
      linkCTA: "Confirm Your New Email Address",
      linkColor: '#2c00f8',
      byline: "&mdash; <a href='http://twitter.com/jbckmn'>Josh</a> @ Embark",
      footerText: "Sent from ",
      footerLink: "http://embark.co?utm_source=email_footer",
      footerLinkText: "Embark"
    };
  mail({
    type: 'confirm',
    from: 'support@embark.co',
    to: acct.email,
    subject: 'Did you change your Embark account?',
    tag: 'reconfirm',
    locals: confirmOpt
  }, function(err, success){
    if(success){
      console.log('sent re-confirmation email');
    }
  });
};

module.exports = mongoose.model('Account', Account);