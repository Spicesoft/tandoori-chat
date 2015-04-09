(function (root, factory) {
    define("locales", ['jquery', 'jed',
        'text!en',
        'text!fr'
        ], function ($, Jed, en, fr) {
            var locales = {
                en: en,
                fr : fr
            };
            return locales;
        });
})(this);
