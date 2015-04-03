require([
    'jquery',
    'tandoori-chat',
    'src/hipchat-api'
], function (
    $,
    chat,
    hipchatAPI
) {

    // in this example, we load parameters from localstorage
    // and give some buttons to create new values

    var boshURL = localStorage.getItem('boshURL');
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.access_token) {
        hipchatAPI.setAccessToken(userInfo.access_token);
    }

    // auto start
    if (boshURL && userInfo) {
        chat.start(boshURL, userInfo);
    }

    $('#get-bosh-url').click(function () {
        var $el = $(this);
        $el.html('Waiting (it is slow)...');
        tandooriAPI.getBoshURL(function (err, url) {
            if (err) {
                $el.html('Error: ' + err);
                return;
            }
            $el.html('BOSH URL: ' + url);
            boshURL = url;
            localStorage.setItem('boshURL', boshURL);
        });
    });

    $('#create-user').click(function () {
        var $el = $(this);
        $el.html('Creating user...');
        tandooriAPI.createUser(function (err, user) {
            if (err) {
                $el.html('Error: ' + err);
                return;
            }
            $el.html('User created: ' + user.name);
            console.log(user);
            userInfo = user;
            hipchatAPI.setAccessToken(userInfo.access_token);
        });
    });

    $('#get-user-info').click(function () {
        var $el = $(this);
        $el.html('Getting user info...');

        hipchatAPI.getUser(userInfo.email, function (err, info) {
            if (err) {
                $el.html('Error: ' + err);
                return;
            }
            console.log(info);
            userInfo.jid = info.xmpp_jid;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            $el.html('User JID: ' + userInfo.jid);
        });
    });

});