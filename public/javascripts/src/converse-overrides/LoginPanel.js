define([
    'jquery',
    'utils',
    'tpl!src/converse-overrides/templates/login_panel'
], function (
    $,
    utils,
    tpl_login_panel
) {
    return function (plugin) {
        var converse = plugin.converse;
        var __ = $.proxy(utils.__, converse);

        return {

            initialize: function (cfg) {
                cfg.$parent.html(this.$el.html(
                    tpl_login_panel({})
                ));
                this.$tabs = cfg.$parent.parent().find('#controlbox-tabs');
            },

            render: function () {
                this.$tabs.append(converse.templates.login_tab({label_sign_in: __('Sign in')}));
                this.$el.find('input#jid').focus();
                if (!this.$el.is(':visible')) {
                    this.$el.show();
                }
                return this;
            },

            remove: function () {
                this.$tabs.empty();
                this.$el.parent().empty();
            }
        };
    };
});
