define([
  'tpl!/javascripts/tandoori-ext/templates/chatroom'
], function (
  tpl_chatroom
) {
  return function (plugin) {
    var converse = plugin.converse;
    return {
      render: function () {
        this.$el.attr('id', this.model.get('box_id'))
                .html(tpl_chatroom(this.model.toJSON()));
        this.renderChatArea();
        setTimeout(function () {
          converse.refreshWebkit();
        }, 50);
        return this;
      }
    };
  };
});