define([
    'jquery',
    'tpl!/javascripts/tandoori-ext/templates/chatroom'
], function (
    $,
    tpl_chatroom
) {
    return function (plugin) {
        var converse = plugin.converse;
        return {
            // replace template
            // inject privacy in class name
            // inject ownership in class name
            render: function () {
                this.$el
                    .attr('id', this.model.get('box_id'))
                    .html(tpl_chatroom(this.model.toJSON()));
                this.$el.addClass(this.model.get('privacy') + '-room'); // private-room or public-room
                var owner = this.model.get('owner');
                if (owner && owner === converse.bare_jid) {
                    this.$el.addClass('user-is-owner');
                }

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
            }

        };
    };
});