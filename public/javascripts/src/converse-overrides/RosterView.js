define([
], function (
) {
    return function (plugin) {
        var converse = plugin.converse;

        return {
            // hide contacts/groups filter
            render: function () {
                this._super.render.apply(this, arguments);
                this.$el.find('.input-button-group').hide();
                // fix height
                this.$roster.css({
                  'max-height' : '100%' // instead of calc(100% - 26px)
                });
                return this;
            }
        };
    };
});
