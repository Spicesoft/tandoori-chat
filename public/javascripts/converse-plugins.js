
define(['strophe'], function (S) {
  var Strophe = S.Strophe;

  return {
    tandoori_autoconnect : function (config) {
      return function (fullConverse) {
        fullConverse.on('initialized', function () {
          if (!fullConverse.connection.connected) {
            // auto connect
            var resource = Strophe.getResourceFromJid(config.jid);
            if (!resource) {
                config.jid += '/converse.js-' + Math.floor(Math.random()*139749825).toString();
            }
            console.log('Forcing connection...');
            fullConverse.connection.connect(config.jid, config.password, fullConverse.onConnect);
          } else {
            console.log('Connecting...');
          }
        });
      };
    },

    tandoori_rooms : function (config) {
      return function (fullConverse) {

        function patchRoomsPanel(roomspanel) {
          // use correct username
          roomspanel.model.save({nick: config.username});
          // hide rooms form
          roomspanel.$el.find('.add-chatroom').hide();
        }

        fullConverse.on('ready', function () {
          var controlbox = fullConverse.chatboxviews.get('controlbox');
          // if roompanel is already rendered
          if (controlbox.roomspanel && controlbox.roomspanel.$el) {
            patchRoomsPanel(controlbox);
          }
          // or when RoomPanel is rendered
          else {
            converse.plugins.extend(fullConverse.ControlBoxView, {
              renderContactsPanel : function () {
                this._super.renderContactsPanel.apply(this, arguments);
                patchRoomsPanel(controlbox);
              }
            });
          }
        });
      };
    },

    tandoori_debug_events : function (config) {
      return function (fullConverse) {
        var events = ["initialized", "ready", "reconnect", "message", "messageSend", "noResumeableSession", "roster", "callButtonClicked", "chatBoxOpened", "chatRoomOpened", "chatBoxClosed", "chatBoxFocused", "chatBoxToggled", "roomInviteSent", "roomInviteReceived", "statusChanged", "statusMessageChanged", "contactStatusChanged", "contactStatusMessageChanged"];
        events.forEach(function (event) {
          fullConverse.on(event, function () {
            console.info('Event:', event);
          });
        });
      };
    }

  };
});