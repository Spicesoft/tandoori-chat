define(['jquery'], function ($) {
  function getUserInfo(user, callback) {
    $.ajax({
      url: 'https://api.hipchat.com/v2/user/' + user.email,
      method: 'get',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + user.access_token);
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
    getUserInfo : getUserInfo,
    createRoom  : function () {},
    deleteRoom  : function () {},
    inviteUser  : function () {},
    removeUser  : function () {},
  };
});