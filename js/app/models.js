// Models
App.Store = DS.Store.extend({
    revision: 12,
    adapter: 'DS.RESTAdapter'
});

DS.RESTAdapter.reopen({
    namespace: 'api',
    url: 'http://10.10.10.148:3000'
});

App.Photo = DS.Model.extend({
    username: DS.attr('string'),
    attachment: DS.attr('string')
});

App.List = DS.Model.extend({
    title: DS.attr('string'),
    done: DS.attr('boolean'),
    total: DS.attr('number'),
    products: DS.hasMany('App.Product')
});

App.Product = DS.Model.extend({
    checked: DS.attr('boolean'),
    title: DS.attr('string')
});

App.User = Ember.Object.create({
    loggedIn: false,
    name: null,
    login: function(username, password) {
        var authorised = (username == 'foo' && password == 'bar');
        if (authorised) {
            this.setProperties({
                loggedIn: true,
                name: 'Mr FooBar'
            });
        }
        return authorised;
    },
    logout: function() {
        this.setProperties({
            loggedIn: false,
            name: null
        });
    }
});