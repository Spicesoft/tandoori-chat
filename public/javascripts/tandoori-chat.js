// main module
define('tandoori-chat', [
    'converse',
    'locales',
    'src/tandoori-converse-plugin',
    'src/hipchat-api'
], function (
    converse,
    locales,
    TandooriPlugin,
    hipchatAPI
) {
    return {
        start : function (boshURL, userInfo) {

            hipchatAPI.setAccessToken(userInfo.access_token);

            // create our plugin
            var tandooriPlugin = new TandooriPlugin({
                converseRoot : '/javascripts/conversejs',
                user : {
                    jid      : userInfo.jid,
                    password : userInfo.password,
                    username : userInfo.name
                }
            });
            window.tandooriPlugin = tandooriPlugin;

            // plug it into converse
            converse.plugins.add('tandoori', function (fullConverse) {
                tandooriPlugin.init(fullConverse);
            });

            converse.initialize({
                bosh_service_url: boshURL,
                i18n: locales['fr'], // Refer to ./locale/locales.js to see which locales are supported
                debug: true,

                allow_contact_removal: false,
                allow_contact_requests: false,
                allow_muc: true,
                allow_otr: false,
                allow_registration: false,
                animate: true,
                auto_list_rooms: true,
                auto_reconnect: false,
                auto_subscribe: false,
                cache_otr_key: false,
                domain_placeholder: null,
                jid: null, // with prebind
                keepalive: true,
                message_carbons: true,
                expose_rid_and_sid: false,
                forward_messages: false, // TODO: test if solve missing message from hipchat
                fullname: null,
                hide_muc_server: true,
                hide_offline_users: false,
                play_sounds: true,
                prebind: false, // TODO: try (require server prebind)
                prebind_url: null,
                providers_link: null,
                roster_groups: false,
                show_controlbox_by_default: false,
                show_only_online_users: false, // = hide busy, absent...
                storage: 'session',
                use_otr_by_default: false,
                use_vcards: true,
                visible_toolbar_buttons: {
                    call: false,
                    clear: true,
                    emoticons: true,
                    toggle_participants: true
                },
                websocket_url: null,
                xhr_custom_status: false,
                xhr_custom_status_url: '',
                xhr_user_search: false,
                xhr_user_search_url: ''
            });

        }

    };
});
