(function (root, factory) {
    define("locales", ['jquery', 'jed',
        'text!en',
        'text!fr'
        ], function ($, Jed, en, fr) {
            root.locales = {
                en: en,
                fr : fr
            };
            return root.locales;
        });
})(this);
