define([
    'jquery',
    'tandoori-chat'
], function (
    $,
    chat
) {

    // load parameters from html
    var parameters;
    try {
        var data = $('script#tandoori-chat-script').attr('data-initial-parameters');
        parameters = JSON.parse(data);
    }
    catch(e) {
        console.error(e);
    }

    // auto start
    chat.start(parameters);

});
