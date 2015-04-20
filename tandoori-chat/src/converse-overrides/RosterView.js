define([
    'jquery',
    'underscore',
    'utils'
], function (
    $,
    _,
    utils
) {
    return function (plugin) {
        var converse = plugin.converse;
        var __ = $.proxy(utils.__, converse);

        var HEADER_CURRENT_CONTACTS =  __('My contacts');
        var HEADER_UNGROUPED = __('Ungrouped');

        var HEADER_ADMINS = __('Administrators');

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
            },

            // custom admin group
            addExistingContact: function (contact) {

                var groups;
                if (converse.roster_groups) {
                    groups = contact.get('groups');
                    if (groups.length === 0) {
                        groups = [HEADER_UNGROUPED];
                    }
                } else {
                    groups = [HEADER_CURRENT_CONTACTS];
                }
                if (this.isAdmin(contact)) {
                    groups = [HEADER_ADMINS];
                }
                _.each(groups, $.proxy(function (name) {
                    this.addContactToGroup(contact, name);
                }, this));
            },

            isAdmin : function (contact) {
                var jid = contact.get('jid');
                return plugin.isAdmin(jid);
            }
        };
    };
});
