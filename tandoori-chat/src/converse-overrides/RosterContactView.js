define([], function () {
    return function (plugin) {
        var converse = plugin.converse;

        return {

            openChat: function (ev) {
                if (ev && ev.preventDefault) { ev.preventDefault(); }
                var offline = this.model.get('chat_status') === 'offline';
                if (offline) {
                    // open chat only with online contacts since offline messages aren't supported
                    return;
                }
                return converse.chatboxviews.showChat(this.model.attributes);
            }

        };
    };
});
