define([], function () {
    return function (plugin) {
        var converse = plugin.converse;

        return {
            initialize : function () {
                this._super.initialize.apply(this, arguments);
            }
        };
    };
});
