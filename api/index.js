var Hipchatter     = require('hipchatter');
var request        = require('request');
var getSessionData = require('./get_session');

var hipchatParams;
var client;
var users = [];

function findUser(id) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === id) return users[i];
  }
}

var API = module.exports = {

  configure : function (params) {
    client = new Hipchatter(params.admin_token);
    hipchatParams = params;
  },

  getBoshURL : function (callback) {
    getSessionData(hipchatParams, function (err, sessionData) {
      if (err) return callback(err);
      callback(null, hipchatParams.base_chat_url + sessionData.bind_url);
    });
  },

  createUser : function (params, callback) {
    client.create_user({
      name : params.name,
      email: params.email
    }, function (err, response) {
      if (err) return callback(err);
      var user = {
        id: String(response.id),
        name: params.name,
        email : params.email,
        password: response.password
      };
      // get access token
      API.getAccessToken(user, function (err, token) {
        if (err) return callback(err);
        user.access_token = token;
        // store user
        users.push(user);
        callback(null, user);
      });
    });
  },

  getAccessToken : function (user, callback) {
    // hipchatter doesn't support this API method
    request.post({
      uri: 'https://api.hipchat.com/v2/oauth/token',
      auth: {
        'bearer': ''
      },
      json: true,
      body : {
        username   : user.email,
        grant_type : 'password',
        password   : user.password
      }
    }, function (err, response, body) {
      console.log(body.access_token);
      callback(err, body.access_token);
    });
  },
/*
  sendMessage : function (senderId, message, callback) {
    var token = findUser(senderId).access_token;
    var room = '1352477';
    client.notify(room, message, token, function () {
      console.log(arguments);
      callback();
    })
  },

  sendPrivateMessage : function (senderId, message, callback) {
    var token = findUser(senderId).access_token;
    var receiverId = ''
    request.post({
      uri: 'https://api.hipchat.com/v2/user/' + receiverId + '/message',
      auth: {
        'bearer': token
      },
      json: true,
      body : {
        message   : message,
        message_format: 'text',
        notify: true
      }
    }, function (err, response, body) {
      console.log(err, body);
      callback();
    });
  }*/
}