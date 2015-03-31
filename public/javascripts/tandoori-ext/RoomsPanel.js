
define([
  'jquery',
  'strophe',
  'utils',
  'tpl!/javascripts/tandoori-ext/templates/room_panel'
], function (
  $,
  S,
  utils,
  tpl_room_panel
) {
  var Strophe = S.Strophe;


  return function (plugin) {
    var converse = plugin.converse;
    var correctNickName = plugin.params.user.username;

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
        'click button#refresh-rooms': 'showRooms'
      },
      render: function () {
        this.$parent.append(
          this.$el.html(
            tpl_room_panel({
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
              })
          ).hide());
        this.$tabs = this.$parent.parent().find('#controlbox-tabs');
        this.$tabs.append(converse.templates.chatrooms_tab({label_rooms: __('Rooms')}));

        // set correct nickname for hipchat
        this.model.save({nick: correctNickName});
        // TODO_TANDOORI: move to template?
        // hide original room join form
        this.$el.find('.add-chatroom').hide();

        return this;
      },

      apiCreateChatRoom : function (ev) {
        ev.preventDefault();
        var name = this.$el.find('input.create-chatroom-name').val();
        var private = this.$el.find('input.create-chatroom-privacy').is(':checked');

        var params = {
          name : name,
          privacy : private ? 'private' : 'public'
        };

        // TODO_TANDOORI: better way than an event?
        converse.emit('apiCreateChatRoom', params);
      },



      testOwnership : function (stanza) {
        var owner_jid = $(stanza).find('x owner').text();
        if (owner_jid) {
          owner_jid = Strophe.getBareJidFromJid(owner_jid);
        }
        var current_jid = converse.bare_jid;

        return current_jid === owner_jid;
      },

      testPrivacy : function (stanza) {
          return $(stanza).find('x privacy').text();
      },

        onRoomsFound: function (iq) {
          /* Handle the IQ stanza returned from the server, containing
           * all its public rooms.
           */
          var name, jid, i, fragment,
              that = this,
              $available_chatrooms = this.$el.find('#available-chatrooms');
          this.rooms = $(iq).find('query').find('item');
          if (this.rooms.length) {
            // # For translators: %1$s is a variable and will be
            // # replaced with the XMPP server name
            // $available_chatrooms.html('<dt>'+__('Rooms on %1$s',this.model.get('muc_domain'))+'</dt>');
            $available_chatrooms.html('<dt>'+__('Rooms available')+'</dt>');// TODO_TANDOORI: i18n

            fragment = document.createDocumentFragment();
            for (i=0; i<this.rooms.length; i++) {
              name = Strophe.unescapeNode($(this.rooms[i]).attr('name')||$(this.rooms[i]).attr('jid'));
              jid = $(this.rooms[i]).attr('jid');
              var isOwner = this.testOwnership(this.rooms[i]);
              var isPrivate = this.testPrivacy(this.rooms[i]);
              // TODO_TANDOORI: display privacy & ownership
              fragment.appendChild($(
                  converse.templates.room_item({
                      'name':name,
                      'jid':jid,
                      'open_title': __('Click to open this room'),
                      'info_title': __('Show more information on this room')
                      })
                  )[0]);
            }
            $available_chatrooms.append(fragment);
            $('input#show-rooms').show().siblings('span.spinner').remove();
          } else {
            this.informNoRoomsFound();
          }
          return true;
      }


    };
  };
});