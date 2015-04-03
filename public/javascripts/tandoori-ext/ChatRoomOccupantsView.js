define([
    'jquery',
    'underscore',
    'utils'
], function (
    $,
    _,
    utils
) {

    return function (plugin) {
        var converse = plugin.converse;
        var __ = $.proxy(utils.__, converse);

        var contains = function (attr, query) {
            return function (item) {
                if (typeof attr === 'object') {
                    var value = false;
                    _.each(attr, function (a) {
                        value = value || item.get(a).toLowerCase().indexOf(query.toLowerCase()) !== -1;
                    });
                    return value;
                } else if (typeof attr === 'string') {
                    return item.get(attr).toLowerCase().indexOf(query.toLowerCase()) !== -1;
                } else {
                    throw new Error('Wrong attribute type. Must be string or array.');
                }
            };
        };


        return {
            events : {
                'click .remove-member' : 'removeMember'
            },

            initialize: function () {
                this.model.on('add', this.onOccupantAdded, this);
                this.model.on('remove', this.onOccupantRemoved, this);
            },
            onOccupantRemoved: function (item) {
                var id = item.get('id');
                var view = this.get(id);
                if (view) {
                    delete view.model; // Remove ref to old model to help garbage collection
                    view.$el.remove();
                    this.remove(id);
                }
            },
            setLoading : function (loading) {
                if (loading === this.loading) {
                    return;
                }
                this.loading = loading;
                if (loading) {
                    this.$el.find('span.spinner');
                    this.$el.children().hide();
                    this.$el.append('<span class="spinner"/>');
                } else {
                    this.$el.children().show();
                    this.$el.find('span.spinner').remove();
                }
            },

            showError : function (action, err) {

            },

            // connect invite widget to hipchat api
            initInviteWidget: function () {
                var $el = this.$('input.invited-contact');
                $el.typeahead({
                    minLength: 1,
                    highlight: true
                }, {
                    name: 'contacts-dataset',
                    source: function (q, cb) {
                        var results = [];
                        _.each(converse.roster.filter(contains(['fullname', 'jid'], q)), function (n) {
                            results.push({value: n.get('fullname'), jid: n.get('jid')});
                        });
                        cb(results);
                    },
                    templates: {
                        suggestion: _.template('<p data-jid="{{jid}}">{{value}}</p>')
                    }
                });
                $el.on('typeahead:selected', $.proxy(function (ev, suggestion/*, dname */) {
                    $(ev.target).typeahead('val', '');
                    var jid = suggestion.jid;
                    var room = this.chatroomview.model.get('name');

                    this.setLoading(true);
                    var self = this;
                    plugin.addMemberToPrivateRoom(jid, room, function (err) {
                        if (err) {
                            self.showError('add-member', err);
                        } else {
                            // reload members?
                        }
                        self.setLoading(false);
                    });
                }, this));
                return this;
            },

            removeMember : function (ev) {
                var name = $(ev.currentTarget).parent().data('name');
                var jid = $(ev.currentTarget).parent().data('jid');
                var room = this.chatroomview.model.get('name');

                if (window.confirm(__('Are you sure you want to remove this member: "%1$s"?', name))) {
                    this.setLoading(true);
                    var self = this;
                    plugin.removeMemberFromPrivateRoom(jid, room, function (err) {
                        if (err) {
                            self.showError('remove-member', err);
                        } else {
                            var member = self.model.findWhere({jid:jid});
                            self.model.remove(member);
                        }
                        self.setLoading(false);
                    });
                }
            },

            // keep unavailable members (displayed differently)
            updateOccupantsOnPresence: function (pres) {
                var occupant;
                var data = this.parsePresence(pres);
                switch (data.type) {
                    case 'error':
                        return true;
                    default:
                        occupant = this.model.get(data.id);
                        if (occupant) {
                            occupant.save(data);
                        } else {
                            this.model.create(data);
                        }
                }
            },
        };
    };
});