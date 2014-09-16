
/*
 * socket.io routing
 */

var fs = require('fs')
    , config = JSON.parse(fs.readFileSync('./static/config.json'))
    , passport = require('passport')
    , gadget = require('../lib/gadget')
    , Account = require('../models/account');

module.exports = function (app, io) {

  io.sockets.on('connection', function (socket) {

    socket.on('mySocketEvent', function (data) {
      
    });

  });

};