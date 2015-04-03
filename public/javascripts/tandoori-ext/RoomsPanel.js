
define([
    'jquery',
    'strophe',
    'utils',
    'tpl!/javascripts/tandoori-ext/templates/room_panel',
    'tpl!/javascripts/tandoori-ext/templates/room_item'
], function (
    $,
    S,
    utils,
    tpl_room_panel,
    tpl_room_item
) {
    var Strophe = S.Strophe;
    var b64_sha1 = S.SHA1.b64_sha1;

    return function (plugin) {
        var converse = plugin.converse;
        var __ = $.proxy(utils.__, converse);

        return {
            events: {
                'submit form.add-chatroom': 'createChatRoom',
                'click input#show-rooms': 'showRooms',
                'click a.open-room': 'createChatRoom',
                'click a.room-info': 'showRoomInfo',
                'change input[name=server]': 'setDomain',
                'change input[name=nick]': 'setNick',

                // add a form to create a new Hipchat Room
                'submit form.create-chatroom': 'apiCreateChatRoom',
                // add a button to refresh room list
                'click button#refresh-rooms': 'reloadRooms',
                // add a button to delete a room
                'click a.delete-room': 'apiDeleteChatRoom'

            },

            render: function () {
                this.$parent.append(
                    this.$el.html(tpl_room_panel({
                        'server_input_type': converse.hide_muc_server && 'hidden' || 'text',
                        'server_label_global_attr': converse.hide_muc_server && ' hidden' || '',
                        'label_room_name': __('Room name'),
                        'label_nickname': __('Nickname'),
                        'label_server': __('Server'),
                        'label_join': __('Join Room'),
                        'label_show_rooms': __('Show rooms'),
                        'label_create_room_name' : __('New room name'),
                        'label_create_room_privacy' : __('Private'),
                        'label_create_room': __('Create room')
                    })).hide());
                this.$tabs = this.$parent.parent().find('#controlbox-tabs');
                this.$tabs.append(converse.templates.chatrooms_tab({label_rooms: __('Rooms')}));

                // TODO_TANDOORI: remove completely?
                // hide original room join form
                this.$el.find('.add-chatroom').hide();

                return this;
            },

            setLoading : function (loading) {
                if (loading === this.loading) {
                    return;
                }
                this.loading = loading;
                if (loading) {
                    this.$el.find('span.spinner');
                    this.$el.children().hide();
                    this.$el.append('<span class="spinner"/>');
                } else {
                    this.$el.children().show();
                    this.$el.find('.add-chatroom').hide(); // keep this one hidden
                    this.$el.find('span.spinner').remove();
                }
            },

            showError : function (action, err) {

            },

            apiCreateChatRoom : function (ev) {
                ev.preventDefault();
                var name = this.$el.find('input.create-chatroom-name').val();
                var private = this.$el.find('input.create-chatroom-privacy').is(':checked');

                var params = {
                    name : name,
                    privacy : private ? 'private' : 'public'
                };

                this.setLoading(true);
                var self = this;
                plugin.createChatRoom(params, function (err) {
                    if (err) {
                        self.showError('create-room', err);
                        self.setLoading(false);
                    } else {
                        self.reloadRooms();
                    }
                });
            },

            reloadRooms : function () {
                this.setLoading(true);
                this.updateRoomsList();
            },

            apiDeleteChatRoom : function (ev) {
                ev.preventDefault();
                var name = $(ev.currentTarget).attr('data-room-name');

                if (window.confirm(__('Are you sure you want to delete this room: "%1$s"?', name))) {
                    this.setLoading(true);
                    var self = this;
                    plugin.deleteChatRoom(name, function (err) {
                        if (err) {
                            self.showError('delete-room', err);
                            self.setLoading(false);
                        } else {
                            // TODO_TANDOORI: just remove the line?
                            self.reloadRooms();
                        }
                    });
                }
            },

            getOwner : function (stanza) {
                var owner_jid = $(stanza).find('x owner').text();
                if (owner_jid) {
                    owner_jid = Strophe.getBareJidFromJid(owner_jid);
                }
                return owner_jid;
            },

            getPrivacy : function (stanza) {
                return $(stanza).find('x privacy').text();
            },

            onRoomsFound: function (iq) {
                this.setLoading(false);
                /* Handle the IQ stanza returned from the server, containing
                 * all its public rooms.
                 */
                var name, rawName, jid, i, fragment,
                    $available_chatrooms = this.$el.find('#available-chatrooms');
                this.rooms = $(iq).find('query').find('item');
                if (this.rooms.length) {
                    $available_chatrooms.html('<dt>' + __('Rooms available') + '</dt>');// TODO_TANDOORI: i18n

                    fragment = document.createDocumentFragment();
                    for (i = 0; i < this.rooms.length; i++) {
                        rawName = $(this.rooms[i]).attr('name');
                        name = Strophe.unescapeNode(rawName || $(this.rooms[i]).attr('jid'));
                        jid = $(this.rooms[i]).attr('jid');

                        var owner = this.getOwner(this.rooms[i]);
                        var privacy = this.getPrivacy(this.rooms[i]);
                        var isOwner = (owner === converse.bare_jid);

                        // TODO_TANDOORI: display privacy?
                        var $el = $(tpl_room_item({
                            'name': name,
                            'jid': jid,
                            'owner': owner,
                            'privacy': privacy,
                            'deleteButton': isOwner,
                            'open_title': __('Click to open this room'),
                            'info_title': __('Show more information on this room')
                        }));
                        $el.find('.open-room').attr('data-room-name', rawName); // inject raw name via jquery to avoid html injection in template
                        $el.find('.delete-room').attr('data-room-name', rawName);

                        fragment.appendChild($el[0]);
                    }
                    $available_chatrooms.append(fragment);
                    $('input#show-rooms').show().siblings('span.spinner').remove();
                } else {
                    this.informNoRoomsFound();
                }
                return true;
            },

            informNoRoomsFound: function () {
                var $available_chatrooms = this.$el.find('#available-chatrooms');
                $available_chatrooms.html('<dt>' + __('No rooms found') + '</dt>'); // TODO_TANDOORI: i18n
                $('input#show-rooms').show().siblings('span.spinner').remove();
            },

            createChatRoom: function (ev) {
                ev.preventDefault();
                var name, $name,
                    server, $server,
                    privacy, owner,
                    jid,
                    $nick = this.$el.find('input.new-chatroom-nick'),
                    nick = $nick.val(),
                    chatroom;

                if (!nick) { $nick.addClass('error'); }
                else { $nick.removeClass('error'); }

                if (ev.type === 'click') {
                    jid = $(ev.target).attr('data-room-jid');
                    name = $(ev.target).attr('data-room-name'); // raw name
                    privacy = $(ev.target).attr('data-room-privacy');
                    owner = $(ev.target).attr('data-room-owner');
                } else {
                    $name = this.$el.find('input.new-chatroom-name');
                    $server = this.$el.find('input.new-chatroom-server');
                    server = $server.val();
                    name = $name.val().trim().toLowerCase();
                    $name.val(''); // Clear the input
                    if (name && server) {
                        jid = Strophe.escapeNode(name) + '@' + server;
                        $name.removeClass('error');
                        $server.removeClass('error');
                        this.model.save({muc_domain: server});
                    } else {
                        if (!name) { $name.addClass('error'); }
                        if (!server) { $server.addClass('error'); }
                        return;
                    }
                }
                if (!nick) { return; }
                chatroom = converse.chatboxviews.showChat({
                    'id': jid,
                    'jid': jid,
                    'name': name || Strophe.unescapeNode(Strophe.getNodeFromJid(jid)),
                    'nick': nick,
                    'owner': owner,
                    'chatroom': true,
                    'privacy': privacy || 'public',
                    'box_id' : b64_sha1(jid)
                });
            }


        };
    };
});