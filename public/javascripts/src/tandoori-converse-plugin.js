define([
    'strophe',
    'converse',
    'src/hipchat-api',
    'src/converse-overrides/ChatBoxView',
    'src/converse-overrides/ChatRoomOccupantView',
    'src/converse-overrides/ChatRoomOccupants',
    'src/converse-overrides/ChatRoomOccupantsView',
    'src/converse-overrides/ChatRoomView',
    'src/converse-overrides/ContactsPanel',
    'src/converse-overrides/ControlBoxView',
    'src/converse-overrides/LoginPanel',
    'src/converse-overrides/RoomsPanel',
    'src/converse-overrides/RosterContactView',
    'src/converse-overrides/RosterView'
], function (
    S,
    conversePublic,
    hipchatAPI,
    TandooriChatBoxView,
    TandooriChatRoomOccupantView,
    TandooriChatRoomOccupants,
    TandooriChatRoomOccupantsView,
    TandooriChatRoomView,
    TandooriContactsPanel,
    TandooriControlBoxView,
    TandooriLoginPanel,
    TandooriRoomsPanel,
    TandooriRosterContactView,
    TandooriRosterView
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

            this.setupStrophe404Interceptor();

            this.debugEvents();
            // connect to chat immediately after page load
            this.autoconnect();
            // add features to converse
            this.patchConverse();
        },

        /*
         * When a 404 occurs, Strophe disconnects and is left in a bad state (can't
         * reconnect automatically).
         *
         * Strophe has a plugin system where plugins are notified of status change
         * but we cannot know the reason. Since this is not enough, we monkey-patch
         * the Bosh requestStateChange listener.
         *
         */
        setupStrophe404Interceptor : function () {
            var plugin = this;

            var _onRequestStateChange = Strophe.Bosh.prototype._onRequestStateChange;

            Strophe.Bosh.prototype._onRequestStateChange = function (func, req) {
                _onRequestStateChange.apply(this, arguments);

                if (req.xhr.readyState === 4) {
                    var reqStatus = 0;
                    try {
                        reqStatus = req.xhr.status;
                    } catch (e) {
                        // ignore errors from undefined status attribute. works around a browser bug
                    }
                    if (reqStatus >= 400 && reqStatus < 500) {
                        plugin.interceptStrophe404();
                    }
                }
            };
        },

        interceptStrophe404 : function () {
            // a 404 error has occured, Strophe is disconnecting
            console.log('A 404 error has been detected, trying to recover.');
            this.recover404();
        },

        patchConverse : function () {
            this.patchSound();

            this.extendConverseClass(this.converse.ChatBoxView, TandooriChatBoxView);
            this.extendConverseClass(this.converse.ChatRoomOccupantView, TandooriChatRoomOccupantView);
            this.extendConverseClass(this.converse.ChatRoomOccupants, TandooriChatRoomOccupants);
            this.extendConverseClass(this.converse.ChatRoomOccupantsView, TandooriChatRoomOccupantsView);
            this.extendConverseClass(this.converse.ChatRoomView, TandooriChatRoomView);
            this.extendConverseClass(this.converse.ContactsPanel, TandooriContactsPanel);
            this.extendConverseClass(this.converse.ControlBoxView, TandooriControlBoxView);
            this.extendConverseClass(this.converse.LoginPanel, TandooriLoginPanel);
            this.extendConverseClass(this.converse.RoomsPanel, TandooriRoomsPanel);
            this.extendConverseClass(this.converse.RosterContactView, TandooriRosterContactView);
            this.extendConverseClass(this.converse.RosterView, TandooriRosterView);
        },

        extendConverseClass : function (ConverseClass, tandooriExtension) {
            conversePublic.plugins.extend(ConverseClass, tandooriExtension(this));
        },

        patchSound : function () {
            var converse = this.converse;
            var converseRoot = this.params.converseRoot;

            converse.playNotification = function () {
                var audio;
                if (converse.play_sounds && typeof Audio !== 'undefined'){
                    audio = new Audio(converseRoot + '/sounds/msg_received.ogg');
                    if (audio.canPlayType('/audio/ogg')) {
                        audio.play();
                    } else {
                        audio = new Audio(converseRoot + '/sounds/msg_received.mp3');
                        audio.play();
                    }
                }
            };
        },

        createChatRoom : function (params, callback) {
            // user requested the creation of a new room
            hipchatAPI.createRoom(params, callback);
        },

        deleteChatRoom : function (roomName, callback) {
            // user requested the removal of a room
            hipchatAPI.deleteRoom(roomName, callback);
        },

        addMemberToPrivateRoom : function (jid, roomName, callback) {
            // user requested the addition of a member to a private room
            var userId = this.jidToId(jid);
            hipchatAPI.addMemberToPrivateRoom(roomName, userId, callback);
        },

        removeMemberFromPrivateRoom : function (jid, roomName, callback) {
            // user requested the removal of a member from a private room
            var userId = this.jidToId(jid);
            hipchatAPI.removeMemberFromPrivateRoom(roomName, userId, callback);
        },

        jidToId : function (jid) {
            // example: 123456_1234567@chat.hipchat.com => 1234567
            var userPart = jid.split('@')[0] || '';
            var userId = userPart.split('_')[1] || '';
            return userId;
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
                user.jid += '/converse.js-' + Math.floor(Math.random() * 139749825).toString();
            }
            this.converse.connection.connect(user.jid, user.password, this.converse.onConnect);
        },

        /*
         * Disconnect converse as cleanly as possible
         * (meaning you can reconnect without reloading the page)
         */
        cleanDisconnect : function () {
            try { this.converse.chatboxviews.closeAllChatBoxes(false); } catch (e) {}
            try { this.converse.clearSession();                        } catch (e) {}
            try { this.converse._tearDown();                           } catch (e) {}
            try { this.converse.connection.disconnect();               } catch (e) {}
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
            var events = ['initialized', 'ready', 'reconnect', 'message', 'messageSend', 'noResumeableSession', 'roster', 'callButtonClicked', 'chatBoxOpened', 'chatRoomOpened', 'chatBoxClosed', 'chatBoxFocused', 'chatBoxToggled', 'roomInviteSent', 'roomInviteReceived', 'statusChanged', 'statusMessageChanged', 'contactStatusChanged', 'contactStatusMessageChanged'];
            events.forEach(function (event) {
                converse.on(event, function () {
                    console.info('Event:', event);
                });
            });
        }

    };

    return TandooriPlugin;
});