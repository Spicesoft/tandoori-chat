define([], function () {
    var staticRootURL = '';
    if (window.static_url) {
        staticRootURL = window.static_url + 'tandoori_chat/';
    }
    else {
        staticRootURL = '/site_media/static/tandoori_chat/';
    }

    var apiURL = '';
    if (window.chat_api_url) {
        apiURL = window.chat_api_url;
    }
    else {
        apiURL = '/chat/params/';
    }

    return {
        debug         : false,
        staticRootURL : staticRootURL,
        apiURL        : apiURL
    };
});
