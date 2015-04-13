define([
    'backbone',
    'strophe',
    'tpl!src/converse-overrides/templates/controlbox'
], function (
    Backbone,
    S,
    tpl_controlbox
) {
    var Strophe = S.Strophe;
    var b64_sha1 = S.SHA1.b64_sha1;

    return function (plugin) {
        var converse = plugin.converse;

        var correctNickName = plugin.params.user.username;
        var mucDomain = plugin.params.mucDomain;

        return {
            events: {
                'click a.close-chatbox-button': 'close',
                'click ul#controlbox-tabs li a': 'switchTab',
                'mousedown .dragresize-tm': 'onDragResizeStart',

                'click a.clear-status': 'clearStatus'
            },

            // change controlbox template
            renderLoginPanel: function () {
                var $feedback = this.$('.conn-feedback'); // we want to still show any existing feedback.
                this.$el.html(tpl_controlbox(this.model.toJSON()));
                var cfg = {'$parent': this.$el.find('.controlbox-panes'), 'model': this};
                if (!this.loginpanel) {
                    this.loginpanel = new converse.LoginPanel(cfg);
                    if (converse.allow_registration) {
                        this.registerpanel = new converse.RegisterPanel(cfg);
                    }
                } else {
                    this.loginpanel.delegateEvents().initialize(cfg);
                    if (converse.allow_registration) {
                        this.registerpanel.delegateEvents().initialize(cfg);
                    }
                }
                this.loginpanel.render();
                if (converse.allow_registration) {
                    this.registerpanel.render().$el.hide();
                }
                this.initDragResize();
                if ($feedback.length) {
                    this.$('.conn-feedback').replaceWith($feedback);
                }
                return this;
            },

            // inject nick and muc_domain
            // change controlbox template
            renderContactsPanel: function () {
                var model;
                this.$el.html(tpl_controlbox(this.model.toJSON()));
                this.contactspanel = new converse.ContactsPanel({'$parent': this.$el.find('.controlbox-panes')});
                this.contactspanel.render();
                converse.xmppstatusview = new converse.XMPPStatusView({'model': converse.xmppstatus});
                converse.xmppstatusview.render();
                if (converse.allow_muc) {
                    this.roomspanel = new converse.RoomsPanel({
                        '$parent': this.$el.find('.controlbox-panes'),
                        'model': new (Backbone.Model.extend({
                            id: b64_sha1('converse.roomspanel'+converse.bare_jid), // Required by sessionStorage
                            browserStorage: new Backbone.BrowserStorage[converse.storage](
                                b64_sha1('converse.roomspanel'+converse.bare_jid))
                        }))()
                    });
                    this.roomspanel.render().model.fetch();
                    if (!this.roomspanel.model.get('nick')) {
                        this.roomspanel.model.save({nick: Strophe.getNodeFromJid(converse.bare_jid)});
                    }
                }
                this.initDragResize();

                this.roomspanel.model.save({
                    nick : correctNickName,
                    muc_domain : mucDomain
                });
            },

            setStatus : function (type, html) {
                var $bar = this.$el.find('.status-bar');
                $bar.removeClass('status-error')
                    .removeClass('status-info')
                    .removeClass('status-none')
                    .addClass('status-' + type);

                $bar.find('.status-message').html(html);
            },
            clearStatus : function () {
                this.setStatus('none', '');
            }
        };
    };
});
