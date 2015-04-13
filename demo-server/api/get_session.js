/* jshint devel:true, node:true */
var request = require('request');

// keep cookies between requests
var cookieJar = request.jar();
request = request.defaults({jar: cookieJar});

function logInAndGetSessionData(params, callback) {
  console.log('Getting XSRF token:');
  getXSRFToken(params, function (err, token) {
    if (err) return callback(err);
    console.log(token);
    console.log('Posting log in form:');
    logIn(params, token, function (err) {
      if (err) return callback(err);
      console.log('Logged in.');
      console.log('Getting session data:');
      getSessionData(params, function (err, session) {
        if (session) {
          console.log('Got session');
        }
        callback(err, session);
      });
    });
  });
}

function getXSRFToken(params, callback) {
  // a real HTML parser would be much better

  var reInput = /<input[^\/]+xsrf_token[^\/]+\/>/g;
  var reValue = /value="([^"]+)"/g;

  request.get(params.sign_in_url, function (err, resp, body) {
    if (err) return callback(err);

    var input      = reInput.exec(body)[0];
    var xsrf_token = reValue.exec(input)[1];

    callback(null, xsrf_token);
  });
}

function logIn(params, token, callback) {
  request.post(params.sign_in_url, {
    form : {
      xsrf_token     : token,
      email          : params.admin_email,
      password       : params.admin_password,
      d              : '',
      signin         : 'Log in',
      stay_signed_in : '1'
    }
  }, function (err, resp, body) {
    // TODO: check that we are really logged in
    callback(err);
  });
}

function getSessionData(params, callback) {
  request.get(params.base_chat_url + params.session_url, function (err, resp, body) {
    if (err) return callback(err);
    var sessionData = JSON.parse(body);
    if (sessionData.error) {
      return callback(new Error(sessionData.error));
    }
    callback(null, sessionData);
  });
}


module.exports = logInAndGetSessionData;