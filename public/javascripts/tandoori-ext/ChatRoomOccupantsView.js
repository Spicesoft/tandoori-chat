define(['jquery', 'underscore'], function ($, _) {
  return function (plugin) {
    var converse = plugin.converse;

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
          $el.on('typeahead:selected', $.proxy(function (ev, suggestion, dname) {
              var jid = suggestion.jid;
              var room = this.chatroomview.model.get('name');
              plugin.addMemberToPrivateRoom(jid, room);
              $(ev.target).typeahead('val', '');
          }, this));
          return this;
      }
    };
  };
});