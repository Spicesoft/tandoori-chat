require([
    'jquery',
    'tandoori-chat',
    'src/hipchat-api',
    'src/tandoori-api'
], function (
    $,
    chat,
    hipchatAPI,
    tandooriAPI
) {

    // in this example, we load parameters from localstorage
    // and give some buttons to create new values

    var boshURL = localStorage.getItem('boshURL');
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.hipchat_access_token) {
        hipchatAPI.setAccessToken(userInfo.hipchat_access_token);
    }

    // auto start
    if (boshURL && userInfo) {
        chat.start({
            bosh_url : boshURL,
            user : userInfo
        });
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
            userInfo = {
                hipchat_access_token: user.access_token,
                hipchat_name: user.name,
                hipchat_password: user.password,
                id: user.id
            };
            hipchatAPI.setAccessToken(userInfo.hipchat_access_token);
        });
    });

    $('#get-user-info').click(function () {
        var $el = $(this);
        $el.html('Getting user info...');

        hipchatAPI.getUser(userInfo.id, function (err, info) {
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