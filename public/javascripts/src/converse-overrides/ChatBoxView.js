define([
    'underscore',
    'moment',
], function (
    _,
    moment
) {
    return function (plugin) {
        var converse = plugin.converse;

        var UNVERIFIED = 1;
        var VERIFIED = 2;

        return {
            // disable slash-commands
            sendMessage: function (text) {
                if (_.contains([UNVERIFIED, VERIFIED], this.model.get('otr_status'))) {
                    // Off-the-record encryption is active
                    this.model.otr.sendMsg(text);
                    this.model.trigger('showSentOTRMessage', text);
                } else {
                    // We only save unencrypted messages.
                    var fullname = converse.xmppstatus.get('fullname');
                    fullname = _.isEmpty(fullname) ? converse.bare_jid : fullname;
                    this.model.messages.create({
                        fullname: fullname,
                        sender: 'me',
                        time: moment().format(),
                        message: text
                    });
                    this.sendMessageStanza(text);
                }
            }
        };
    };
});

