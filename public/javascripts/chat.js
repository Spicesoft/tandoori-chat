
define([
  'jquery',
  'underscore',
  'converse',
  '/javascripts/converse-plugins.js',
  '/javascripts/tandoori-api.js',
  '/javascripts/hipchat-api.js'
], function (
  $,
  _,
  converse,
  conversePlugins,
  tandooriAPI,
  hipchatAPI
) {

  var boshURL = localStorage.getItem('boshURL');
  var userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.access_token) {
    hipchatAPI.setAccessToken(userInfo.access_token);
  }

  function start() {

    // auto start
    if (boshURL && userInfo) {
      setupChat(boshURL, userInfo);
    }

    $('#get-bosh-url').click(function () {
      var $el = $(this);
      $el.html('Waiting (it is slow)...');
      tandooriAPI.getBoshURL(function (err, url) {
        if (err) {
          $el.html('Error: ' + err);
          return;
        }
        $el.html('BOSH URL: ' + url);
        boshURL = url;
        localStorage.setItem('boshURL', boshURL);
      });
    });

    $('#create-user').click(function () {
      var $el = $(this);
      $el.html('Creating user...');
      tandooriAPI.createUser(function (err, user) {
        if (err) {
          $el.html('Error: ' + err);
          return;
        }
        $el.html('User created: ' + user.name);
        console.log(user);
        userInfo = user;
        hipchatAPI.setAccessToken(userInfo.access_token);
      });
    });

    $('#get-user-info').click(function () {
      var $el = $(this);
      $el.html('Getting user info...');

      hipchatAPI.getUser(userInfo.email, function (err, info) {
        if (err) {
          $el.html('Error: ' + err);
          return;
        }
        console.log(info);
        userInfo.jid = info.xmpp_jid;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        $el.html('User JID: ' + userInfo.jid);
      });
    });

    $('#connect-chat').click(function () {
      setupChat(boshURL, userInfo);
    });

    $('#disconnect-chat').click(function () {
      converse.disconnect();
    });

    $('#create-room').submit(function (ev) {
      ev.preventDefault();
      var name = $(this).find('input[name="room-name"]').val();
      var private = $(this).find('input[name="room-privacy"]').is(':checked');
      var $submitBtn = $(this).find('input[type="submit"]');
      hipchatAPI.createRoom({
        name : name,
        privacy : private ? 'private' : 'public'
      }, function (err, result) {
        if (err) {
          $submitBtn.val('Error: ' + err);
          return;
        }
        $submitBtn.val('Room created:' + result.id);
      });
    });
  }

    $('#add-member').submit(function (ev) {
      ev.preventDefault();
      var room = $(this).find('input[name="room-name"]').val();
      var member = $(this).find('input[name="member-email"]').val();
      var $submitBtn = $(this).find('input[type="submit"]');
      hipchatAPI.addMemberToPrivateRoom(room, member, function (err, result) {
        if (err) {
          $submitBtn.val('Error: ' + err);
          return;
        }
        debugger;
        $submitBtn.val('Member added.');
      });
    });
  function setupChat(boshURL, userInfo) {

    $('#remove-member').submit(function (ev) {
      ev.preventDefault();
      var room = $(this).find('input[name="room-name"]').val();
      var member = $(this).find('input[name="member-email"]').val();
      var $submitBtn = $(this).find('input[type="submit"]');
      hipchatAPI.removeMemberFromPrivateRoom(room, member, function (err, result) {
        if (err) {
          $submitBtn.val('Error: ' + err);
          return;
        }
        $submitBtn.val('Member removed');
      });
    });
    converse.plugins.add('tandoori_debug_events', conversePlugins.tandoori_debug_events());

    converse.plugins.add('tandoori_autoconnect', conversePlugins.tandoori_autoconnect({
      jid : userInfo.jid,
      password : userInfo.password
    }));

    converse.plugins.add('tandoori_rooms', conversePlugins.tandoori_rooms({
      username: userInfo.name
    }));

    converse.initialize({
      //bosh_service_url: '/http-bind/web-d13',
      //bosh_service_url: 'https://tandoori.hipchat.com/http-bind/web-e16',
      bosh_service_url: boshURL,
      i18n: locales['en'], // Refer to ./locale/locales.js to see which locales are supported
      debug: true,

      allow_contact_removal: false,
      allow_contact_requests: false,
      allow_muc: true,
      allow_otr: false,
      allow_registration: false,
      animate: false,
      auto_list_rooms: true,
      auto_reconnect: false,
      auto_subscribe: false,
      cache_otr_key: false,
      domain_placeholder: null,
      jid: null, // with prebind
      keepalive: true,
      message_carbons: true,
      expose_rid_and_sid: false,
      forward_messages: false, // TODO: test if solve missing message from hipchat
      fullname: null,
      hide_muc_server: true,
      hide_offline_users: true,
      play_sounds: true,
      prebind: false, // TODO: try (require server prebind)
      prebind_url: null,
      providers_link: null,
      roster_groups: false,
      show_controlbox_by_default: true,
      show_only_online_users: false,
      storage: 'session',
      use_otr_by_default: false,
      use_vcards: true,
      visible_toolbar_buttons: {
        call: false,
        clear: true,
        emoticons: true,
        toggle_participants: true
      },
      websocket_url: null,
      xhr_custom_status: false,
      xhr_custom_status_url: '',
      xhr_user_search: false,
      xhr_user_search_url: ''
    });

  }

  return {
    start : start
  };
});