define([], function () {
    return function (plugin) {
        var converse = plugin.converse;

        return {
            comparator : function (a, b) {
                // type is null (= available) or 'unavailable'
                var typeA = a.get('type');
                var typeB = b.get('type');

                // special case for dummy model
                if (a.get('id') == null) {
                    return -1;
                }
                if (b.get('id') == null) {
                    return 1;
                }
                // special case for owner
                if (a.get('affiliation') === 'owner') {
                    return -1;
                }
                if (b.get('affiliation') === 'owner') {
                    return 1;
                }
                // normal cases
                if (typeA === typeB) {
                    return a.get('nick').localeCompare(b.get('nick'));
                }
                if (typeA == null) {
                    return -1;
                }
                if (typeB == null) {
                    return 1;
                }
            }
        };
    };
});
