require.config({
    baseUrl: 'javascripts/',
    paths: {
        "converse":                 "conversejs/converse",
        "backbone":                 "conversejs/components/backbone/backbone",
        "backbone.browserStorage":  "conversejs/components/backbone.browserStorage/backbone.browserStorage",
        "backbone.overview":        "conversejs/components/backbone.overview/backbone.overview",
        "converse-dependencies":    "conversejs/src/deps-no-otr",
        "converse-templates":       "conversejs/src/templates",
        "eventemitter":             "conversejs/components/otr/build/dep/eventemitter",
        "jquery":                   "conversejs/components/jquery/dist/jquery",
        "jquery-private":           "conversejs/src/jquery-private",
        "jquery.browser":           "conversejs/components/jquery.browser/dist/jquery.browser",
        "moment":                   "conversejs/components/momentjs/moment",
        "strophe-base64":           "conversejs/components/strophejs/src/base64",
        "strophe-bosh":             "conversejs/components/strophejs/src/bosh",
        "strophe-core":             "conversejs/components/strophejs/src/core",
        "strophe":                  "conversejs/components/strophejs/src/wrapper",
        "strophe-md5":              "conversejs/components/strophejs/src/md5",
        "strophe-sha1":             "conversejs/components/strophejs/src/sha1",
        "strophe-websocket":        "conversejs/components/strophejs/src/websocket",
        "strophe-polyfill":         "conversejs/components/strophejs/src/polyfills",
        "strophe.disco":            "conversejs/components/strophejs-plugins/disco/strophe.disco",
        "strophe.roster":           "conversejs/src/strophe.roster",
        "strophe.vcard":            "conversejs/src/strophe.vcard",
        "text":                     'conversejs/components/requirejs-text/text',
        "tpl":                      'conversejs/components/requirejs-tpl-jcbrand/tpl',
        "typeahead":                "conversejs/components/typeahead.js/index",
        "underscore":               "conversejs/components/underscore/underscore",
        "utils":                    "conversejs/src/utils",

        // Off-the-record-encryption
        "bigint":               "conversejs/src/bigint",
        "crypto":               "conversejs/src/crypto",
        "crypto.aes":           "conversejs/components/otr/vendor/cryptojs/aes",
        "crypto.cipher-core":   "conversejs/components/otr/vendor/cryptojs/cipher-core",
        "crypto.core":          "conversejs/components/otr/vendor/cryptojs/core",
        "crypto.enc-base64":    "conversejs/components/otr/vendor/cryptojs/enc-base64",
        "crypto.evpkdf":        "conversejs/components/crypto-js-evanvosberg/src/evpkdf",
        "crypto.hmac":          "conversejs/components/otr/vendor/cryptojs/hmac",
        "crypto.md5":           "conversejs/components/crypto-js-evanvosberg/src/md5",
        "crypto.mode-ctr":      "conversejs/components/otr/vendor/cryptojs/mode-ctr",
        "crypto.pad-nopadding": "conversejs/components/otr/vendor/cryptojs/pad-nopadding",
        "crypto.sha1":          "conversejs/components/otr/vendor/cryptojs/sha1",
        "crypto.sha256":        "conversejs/components/otr/vendor/cryptojs/sha256",
        "salsa20":              "conversejs/components/otr/build/dep/salsa20",
        "otr":                  "conversejs/src/otr",

        // Locales paths
        "locales":   "conversejs/src/locales",
        "jed":       "conversejs/components/jed/jed",
        "af":        "conversejs/locale/af/LC_MESSAGES/converse.json",
        "de":        "conversejs/locale/de/LC_MESSAGES/converse.json",
        "en":        "conversejs/locale/en/LC_MESSAGES/converse.json",
        "es":        "conversejs/locale/es/LC_MESSAGES/converse.json",
        "fr":        "conversejs/locale/fr/LC_MESSAGES/converse.json",
        "he":        "conversejs/locale/he/LC_MESSAGES/converse.json",
        "hu":        "conversejs/locale/hu/LC_MESSAGES/converse.json",
        "id":        "conversejs/locale/id/LC_MESSAGES/converse.json",
        "it":        "conversejs/locale/it/LC_MESSAGES/converse.json",
        "ja":        "conversejs/locale/ja/LC_MESSAGES/converse.json",
        "nb":        "conversejs/locale/nb/LC_MESSAGES/converse.json",
        "nl":        "conversejs/locale/nl/LC_MESSAGES/converse.json",
        "pl":        "conversejs/locale/pl/LC_MESSAGES/converse.json",
        "pt_BR":     "conversejs/locale/pt_BR/LC_MESSAGES/converse.json",
        "ru":        "conversejs/locale/ru/LC_MESSAGES/converse.json",
        "zh":        "conversejs/locale/zh/LC_MESSAGES/converse.json",

        // Templates
        "action":                   "conversejs/src/templates/action",
        "add_contact_dropdown":     "conversejs/src/templates/add_contact_dropdown",
        "add_contact_form":         "conversejs/src/templates/add_contact_form",
        "change_status_message":    "conversejs/src/templates/change_status_message",
        "chat_status":              "conversejs/src/templates/chat_status",
        "chatarea":                 "conversejs/src/templates/chatarea",
        "chatbox":                  "conversejs/src/templates/chatbox",
        "chatroom":                 "conversejs/src/templates/chatroom",
        "chatroom_password_form":   "conversejs/src/templates/chatroom_password_form",
        "chatroom_sidebar":         "conversejs/src/templates/chatroom_sidebar",
        "chatrooms_tab":            "conversejs/src/templates/chatrooms_tab",
        "chats_panel":              "conversejs/src/templates/chats_panel",
        "choose_status":            "conversejs/src/templates/choose_status",
        "contacts_panel":           "conversejs/src/templates/contacts_panel",
        "contacts_tab":             "conversejs/src/templates/contacts_tab",
        "controlbox":               "conversejs/src/templates/controlbox",
        "controlbox_toggle":        "conversejs/src/templates/controlbox_toggle",
        "field":                    "conversejs/src/templates/field",
        "form_captcha":             "conversejs/src/templates/form_captcha",
        "form_checkbox":            "conversejs/src/templates/form_checkbox",
        "form_input":               "conversejs/src/templates/form_input",
        "form_select":              "conversejs/src/templates/form_select",
        "form_textarea":            "conversejs/src/templates/form_textarea",
        "form_username":            "conversejs/src/templates/form_username",
        "group_header":             "conversejs/src/templates/group_header",
        "info":                     "conversejs/src/templates/info",
        "login_panel":              "conversejs/src/templates/login_panel",
        "login_tab":                "conversejs/src/templates/login_tab",
        "message":                  "conversejs/src/templates/message",
        "new_day":                  "conversejs/src/templates/new_day",
        "occupant":                 "conversejs/src/templates/occupant",
        "pending_contact":          "conversejs/src/templates/pending_contact",
        "pending_contacts":         "conversejs/src/templates/pending_contacts",
        "register_panel":           "conversejs/src/templates/register_panel",
        "register_tab":             "conversejs/src/templates/register_tab",
        "registration_form":        "conversejs/src/templates/registration_form",
        "registration_request":     "conversejs/src/templates/registration_request",
        "requesting_contact":       "conversejs/src/templates/requesting_contact",
        "requesting_contacts":      "conversejs/src/templates/requesting_contacts",
        "room_description":         "conversejs/src/templates/room_description",
        "room_item":                "conversejs/src/templates/room_item",
        "room_panel":               "conversejs/src/templates/room_panel",
        "roster":                   "conversejs/src/templates/roster",
        "roster_item":              "conversejs/src/templates/roster_item",
        "search_contact":           "conversejs/src/templates/search_contact",
        "select_option":            "conversejs/src/templates/select_option",
        "status_option":            "conversejs/src/templates/status_option",
        "toggle_chats":             "conversejs/src/templates/toggle_chats",
        "toolbar":                  "conversejs/src/templates/toolbar",
        "trimmed_chat":             "conversejs/src/templates/trimmed_chat"
    },

    map: {
        // '*' means all modules will get 'jquery-private'
        // for their 'jquery' dependency.
        '*': { 'jquery': 'jquery-private' },
        // 'jquery-private' wants the real jQuery module
        // though. If this line was not here, there would
        // be an unresolvable cyclic dependency.
        'jquery-private': { 'jquery': 'jquery' }
    },

    tpl: {
        // Configuration for requirejs-tpl
        // Use Mustache style syntax for variable interpolation
        templateSettings: {
            evaluate : /\{\[([\s\S]+?)\]\}/g,
            interpolate : /\{\{([\s\S]+?)\}\}/g
        }
    },

    // define module dependencies for modules not using define
    shim: {
        'crypto.aes':           { deps: ['crypto.cipher-core'] },
        'crypto.cipher-core':   { deps: ['crypto.enc-base64', 'crypto.evpkdf'] },
        'crypto.enc-base64':    { deps: ['crypto.core'] },
        'crypto.evpkdf':        { deps: ['crypto.md5'] },
        'crypto.hmac':          { deps: ['crypto.core'] },
        'crypto.md5':           { deps: ['crypto.core'] },
        'crypto.mode-ctr':      { deps: ['crypto.cipher-core'] },
        'crypto.pad-nopadding': { deps: ['crypto.cipher-core'] },
        'crypto.sha1':          { deps: ['crypto.core'] },
        'crypto.sha256':        { deps: ['crypto.core'] },
        'bigint':               { deps: ['crypto'] },
        'strophe.disco':        { deps: ['strophe'] },
        'strophe.register':     { deps: ['strophe'] },
        'strophe.roster':       { deps: ['strophe'] },
        'strophe.vcard':        { deps: ['strophe'] }
    },

    config : {
        'tandoori-chat' : {
            debug : true,
            staticRoot : '/javascripts/conversejs/'
        }
    }
});