define(['jquery'], function ($) {

    function createUser(callback) {
        $.ajax({
            url: '/hipchat/user',
            method: 'post',
            success : function (result) {
                if (result.success === false) {
                    return callback(result.error);
                }
                callback(null, result.user);
            },
            error : function (xhr, status, err) {
                callback(err);
            }
        });
    }


    function getBoshURL(callback) {
        $.ajax({
            url: '/hipchat/bosh_url',
            method: 'get',
            success : function (result) {
                if (result.success === false) {
                    return callback(result.error);
                }
                callback(null, result.bosh_url);
            },
            error : function (xhr, status, err) {
                callback(err);
            }
        });
    }

    return {
        getBoshURL : getBoshURL,
        // dev api
        createUser : createUser
    };

});