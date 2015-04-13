define("converse-dependencies", [
    "underscore",
    "jquery",
    "utils",
    "moment",
    "strophe",
    "strophe.roster",
    "strophe.vcard",
    "strophe.disco",
    "backbone.browserStorage",
    "backbone.overview",
    "jquery.browser",
    "typeahead"
], function(_, $, utils, moment, Strophe) {
    _.noConflict();
    return _.extend({
        'underscore': _,
        'jQuery': $,
        'otr': undefined,
        'moment': moment,
        'utils': utils
    }, Strophe);
});
