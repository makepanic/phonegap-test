// Models
App.Store = DS.Store.extend({
    revision: 12,
    adapter: 'DS.RESTAdapter'
});

App.Photo = DS.Model.extend({
    username: DS.attr('string'),
    attachment: DS.attr('string')
});