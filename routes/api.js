
/*
 * API routing
 */

var fs = require('fs')
    , request = require('request')
    , config = JSON.parse(fs.readFileSync('./static/config.json'))
    , gadget = require('../lib/gadget')
    , Account = require('../models/account')
    , passport = require('passport')
    , newTime
    , response
    , subURL
    , key;

module.exports = function (app, ensureApiAuth, io) {

  app.get('/aa', function(req, res){
    
  });

};