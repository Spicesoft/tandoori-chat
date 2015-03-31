define(['jquery'], function ($) {
  var access_token;

  function request(method, url, body, callback) {
    if (!callback) {
      callback = body;
      body = '';
    }

    $.ajax({
      url: 'https://api.hipchat.com/v2' + url,
      method: method,
      data : body ? JSON.stringify(body) : null,
      contentType: 'application/json',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
      },
      success : function (result) {
        callback(null, result);
      },
      error : function (xhr, status, err) {
        callback(err);
      }
    });
  }




  return {
    request: request,
    setAccessToken : function (token) {access_token = token;},

    getUser : function (emailOrId, callback) {
      request('get', '/user/' + emailOrId, callback);
    },

    createRoom : function (params, callback) {
      request('post', '/room', params, callback);
    },

    deleteRoom : function (idOrName, callback) {
      request('delete',  '/room/' + idOrName, callback);
    },

    getRoomMembers : function (roomNameOrId, callback) {
      request('get', '/room/' + roomNameOrId + '/member', callback);
    },

    addMemberToPrivateRoom : function (roomNameOrId, emailOrId, callback) {
      request('put', '/room/' + roomNameOrId + '/member/' + emailOrId, callback);
    },

    removeMemberFromPrivateRoom : function (roomNameOrId, emailOrId, callback) {
      request('delete', '/room/' + roomNameOrId + '/member/' + emailOrId, callback);
    }
  };
});