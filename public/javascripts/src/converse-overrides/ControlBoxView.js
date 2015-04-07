define([], function () {
    return function (plugin) {
        var converse = plugin.converse;

        var correctNickName = plugin.params.user.username;
        var mucDomain = plugin.params.mucDomain;

        return {
            renderContactsPanel : function () {
                this._super.renderContactsPanel.apply(this, arguments);
                this.roomspanel.model.save({
                    nick : correctNickName,
                    muc_domain : mucDomain
                });
            }
        };
    };
});