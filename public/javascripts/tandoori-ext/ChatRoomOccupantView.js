define([
    'jquery',
    'underscore',
    'utils',
    'tpl!/javascripts/tandoori-ext/templates/occupant'
], function (
    $,
    _,
    utils,
    tpl_occupant
) {
    return function (plugin) {
        var converse = plugin.converse;
        var __ = $.proxy(utils.__, converse);

        return {
            // replace template
            render: function () {
                var $new = tpl_occupant(
                    _.extend(this.model.toJSON(), {
                        'desc_moderator': __('This user is a moderator'),
                        'desc_participant': __('This user can send messages in this room'),
                        'desc_visitor': __('This user can NOT send messages in this room'),
                        'desc_unavailable': __('This user is unavailable') // TODO_TANDOORI: i18n
                    })
                );
                this.$el.replaceWith($new);
                this.setElement($new, true);
                return this;
            }
        };
    };
});
