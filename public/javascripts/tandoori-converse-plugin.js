
define([
  'strophe',
  'converse',
  '/javascripts/hipchat-api.js',
  '/javascripts/tandoori-ext/LoginPanel.js',
  '/javascripts/tandoori-ext/RoomsPanel.js',
  '/javascripts/tandoori-ext/ContactsPanel.js',
  '/javascripts/tandoori-ext/RosterContactView.js',
  '/javascripts/tandoori-ext/ChatRoomView.js',
], function (
  S,
  conversePublic,
  hipchatAPI,
  TandooriLoginPanel,
  TandooriRoomsPanel,
  TandooriContactsPanel,
  TandooriRosterContactView,
  TandooriChatRoomView
) {
  var Strophe = S.Strophe;

  /*
   * this.converse is the private instance of the Converse library
   * conversePublic is the public instance of the Converse library
   * (only the public version has the plugin interface)
   */

  // hide the global converse if there's one, to avoid using 'converse' instead of 'this.converse'.
  var converse;

  function TandooriPlugin(params) {
    this.params = params;
  }

  TandooriPlugin.prototype = {
    init : function (converse) {
      this.converse = converse;
      this.debugEvents();
      // connect to chat immediately after page load
      this.autoconnect();
      // add features to converse
      this.patchConverse();

      this.bindEvents();
    },

    bindEvents : function () {
      this.converse.off('apiCreateChatRoom', this.onAPICreateChatRoom, this);
      this.converse.on('apiCreateChatRoom', this.onAPICreateChatRoom, this);
    },

    patchConverse : function () {
      this.extendConverseClass(this.converse.LoginPanel, TandooriLoginPanel);
      this.extendConverseClass(this.converse.RoomsPanel, TandooriRoomsPanel);
      this.extendConverseClass(this.converse.ContactsPanel, TandooriContactsPanel);
      this.extendConverseClass(this.converse.RosterContactView, TandooriRosterContactView);
      this.extendConverseClass(this.converse.ChatRoomView, TandooriChatRoomView);
    },

    extendConverseClass : function (ConverseClass, TandooriExtension) {
      conversePublic.plugins.extend(ConverseClass, TandooriExtension(this));
    },

    onAPICreateChatRoom : function(ev, params) {
      // user requested the creation of a new room
      hipchatAPI.createRoom(params, function (err, result) {
        if (err) {
          console.error('Room creation failed:', err);
          return;
        }
        console.log('Room creation:', result);
      });
    },

    /*
     * After initilization, we check if a connection as already been established
     * by converse. If not, we open a connection.
     *
     * params : {
     *   jid,
     *   password
     * }
     */
    autoconnect : function () {
      var converse = this.converse;
      var self = this;

      converse.on('initialized', function () {
        if (!converse.connection.connected) {
          // auto connect
          console.log('Forcing connection...');
          self.connect();
        } else {
          console.log('Connecting...');
        }
      });
    },

    connect : function () {
      var user = this.params.user;
      var resource = Strophe.getResourceFromJid(user.jid);
      if (!resource) {
        user.jid += '/converse.js-' + Math.floor(Math.random()*139749825).toString();
      }
      this.converse.connection.connect(user.jid, user.password, this.converse.onConnect);
    },

    /*
     * Disconnect converse as cleanly as possible
     * (meaning you can reconnect without reloading the page)
     */
    cleanDisconnect : function () {
      try { this.converse.chatboxviews.closeAllChatBoxes(false); } catch (e) {console.error('cleanDisconnect', e);}
      try { this.converse.clearSession();                        } catch (e) {console.error('cleanDisconnect', e);}
      try { this.converse._tearDown();                           } catch (e) {console.error('cleanDisconnect', e);}
      try { this.converse.connection.disconnect();               } catch (e) {console.error('cleanDisconnect', e);}
    },

    recover404 : function () {
      this.cleanDisconnect();
      this.connect();
    },

    /*
     * Simple logger for converse events.
     */
    debugEvents : function () {
      var converse = this.converse;
      var events = ["initialized", "ready", "reconnect", "message", "messageSend", "noResumeableSession", "roster", "callButtonClicked", "chatBoxOpened", "chatRoomOpened", "chatBoxClosed", "chatBoxFocused", "chatBoxToggled", "roomInviteSent", "roomInviteReceived", "statusChanged", "statusMessageChanged", "contactStatusChanged", "contactStatusMessageChanged"];
      events.forEach(function (event) {
        converse.on(event, function () {
          console.info('Event:', event);
        });
      });
    }

  };

  return TandooriPlugin;
});