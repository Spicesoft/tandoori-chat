define([
], function (
) {
    return function (plugin) {
        var converse = plugin.converse;

        return {
            // hide contacts/groups selector
            render: function () {
                this._super.render.apply(this, arguments);

                var $filter = this.$('.roster-filter');
                var $type = this.$('.filter-type');

                $type.hide();
                $filter.css('width', '100%');

                return this;
            },

            // fix: don't show the type selector
            showHideFilter: function () {
                if (!this.$el.is(':visible')) {
                    return;
                }
                var $filter = this.$('.roster-filter');
                var visible = $filter.is(':visible');
                if (visible && $filter.val().length > 0) {
                    // Don't hide if user is currently filtering.
                    return;
                }
                if (this.$roster.hasScrollBar()) {
                    if (!visible) {
                        $filter.show();
                    }
                }
                else {
                    $filter.hide();
                }
                return this;
            }
        };
    };
});
