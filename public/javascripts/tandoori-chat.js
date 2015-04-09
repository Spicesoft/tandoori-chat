// main module
define('tandoori-chat', [
    'module',
    'converse',
    'locales',
    'src/tandoori-converse-plugin',
    'src/hipchat-api'
], function (
    module,
    converse,
    locales,
    TandooriPlugin,
    hipchatAPI
) {
    var config = module.config();

    return {
        checkParameters : function (parameters) {
            if (!parameters) {
                throw new Error('Missing parameters.');
            }
            if (!parameters.bosh_url) {
                throw new Error('Missing bosh_url.');
            }

            if (!parameters.user) {
                throw new Error('Missing user parameters.');
            }

            if (!parameters.user.hipchat_access_token) {
                throw new Error('Missing hipchat_access_token.');
            }

            if (!parameters.user.hipchat_name) {
                throw new Error('Missing hipchat_name.');
            }

            if (!parameters.user.hipchat_password) {
                throw new Error('Missing hipchat_password.');
            }

            if (!parameters.user.id) {
                throw new Error('Missing id.');
            }
        },
        start : function (parameters) {
            this.checkParameters(parameters);

            var boshURL = parameters.bosh_url;
            var userInfo = parameters.user;

            hipchatAPI.setAccessToken(userInfo.hipchat_access_token);

            if (userInfo.jid) {
                this.startConverse(boshURL, userInfo);
            } else {
                // get jid
                var self = this;
                hipchatAPI.getUser(userInfo.id, function (err, info) {
                    if (err) {
                        throw new Error('Could not retrieve user JID');
                    }
                    userInfo.jid = info.xmpp_jid;
                    self.startConverse(boshURL, userInfo);
                });
            }

        },
        startConverse : function (boshURL, userInfo) {
            // create our plugin
            var tandooriPlugin = new TandooriPlugin({
                debug        : config.debug,
                converseRoot : config.staticRoot || '/',
                mucDomain    : 'conf.hipchat.com',
                user : {
                    jid      : userInfo.jid,
                    password : userInfo.hipchat_password,
                    username : userInfo.hipchat_name
                }
            });

            if (config.debug) {
                window.tandooriPlugin = tandooriPlugin;
            }

            // plug it into converse
            converse.plugins.add('tandoori', function (fullConverse) {
                tandooriPlugin.init(fullConverse);
            });

            converse.initialize({
                bosh_service_url: boshURL,
                i18n: locales['fr'], // Refer to ./locale/locales.js to see which locales are supported
                debug: config.debug,

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
