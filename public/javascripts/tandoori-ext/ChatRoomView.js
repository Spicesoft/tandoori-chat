define([
  'jquery',
  'strophe',
  'tpl!/javascripts/tandoori-ext/templates/chatroom'
], function (
  $,
  S,
  tpl_chatroom
) {
  var b64_sha1 = S.SHA1.b64_sha1;

  return function (plugin) {
    var converse = plugin.converse;
    return {
      // replace template
      render: function () {
        this.$el.attr('id', this.model.get('box_id'))
                .html(tpl_chatroom(this.model.toJSON()));
        this.renderChatArea();
        setTimeout(function () {
          converse.refreshWebkit();
        }, 50);
        return this;
      },

      // add support for mid
      onChatRoomMessage: function (message) {
        var $message = $(message);
        var msgid = $message.attr('id') || $message.attr('mid');
        $message.attr('id', msgid);

        return this._super.onChatRoomMessage.apply(this, arguments);
      },

      // disable slash-commands
      sendChatRoomMessage: function (text) {
        this.createChatRoomMessage(text);
      },

      // fix occupants being shared between chat rooms
      initialize: function () {
          this.model.messages.on('add', this.onMessageAdded, this);
          this.model.on('change:minimized', function (item) {
              if (item.get('minimized')) {
                  this.hide();
              } else {
                  this.maximize();
              }
          }, this);
          this.model.on('destroy', function (model, response, options) {
              this.hide().leave();
          },
          this);

          this.occupantsview = new converse.ChatRoomOccupantsView({
              model: new converse.ChatRoomOccupants({nick: this.model.get('nick')})
          });

          // fix browser storage id
          var id =  b64_sha1('converse.occupants'+converse.bare_jid+this.model.get('id')+this.model.get('nick'));
          this.occupantsview.model.id = id;
          this.occupantsview.model.browserStorage = new Backbone.BrowserStorage[converse.storage](id);
          // end of fix

          this.occupantsview.chatroomview = this;
          this.render();
          this.occupantsview.model.fetch({add:true});
          this.join(null);
          converse.emit('chatRoomOpened', this);

          this.$el.insertAfter(converse.chatboxviews.get("controlbox").$el);
          this.model.messages.fetch({add: true});
          if (this.model.get('minimized')) {
              this.hide();
          } else {
              this.show();
          }
      }

    };
  };
});