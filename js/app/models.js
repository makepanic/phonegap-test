// Models
App.Store = DS.Store.extend({
    revision: 12,
    adapter: 'DS.FixtureAdapter'
});
//
//App.Contact = DS.Model.extend({
//    name: DS.attr('string'),
//    img: DS.attr('string'),
//    tel: DS.attr('string')
//});
//
//App.Contact.FIXTURES = [];
//for(var i = 0; i < 50; i ++){
//    App.Contact.FIXTURES.push({
//        id: i+1,
//        name: 'Contact ' + (i + 1),
//        img: 'http://placehold.it/150x150',
//        tel: '012354678'
//    })
//}

App.PhonegapContact = DS.Model.extend({
    pid: DS.attr('string'),
    displayName: DS.attr('string'),
    name: DS.attr('string'),
    nickname: DS.attr('string'),
    birthday: DS.attr('date'),
    note: DS.attr('string')
});

App.PhonegapContact.FIXTURES = [];
/*for(var i = 0; i < 50; i ++){
    App.PhonegapContact.FIXTURES.push({
        id: i+1,
        pid: '#' + Math.floor(Math.random()*16777215).toString(16),
        displayName: 'DisplayName ' + (i + 1),
        nickname: 'Nickname' + (i + 1),
        birthday: new Date(),
        note: 'Note ' + (i + 1)
    })
}*/

/*
*
* id: A globally unique identifier. (DOMString)
 displayName: The name of this Contact, suitable for display to end-users. (DOMString)
 name: An object containing all components of a persons name. (ContactName)
 nickname: A casual name to address the contact by. (DOMString)
 phoneNumbers: An array of all the contact's phone numbers. (ContactField[])
 emails: An array of all the contact's email addresses. (ContactField[])
 addresses: An array of all the contact's addresses. (ContactAddresses[])
 ims: An array of all the contact's IM addresses. (ContactField[])
 organizations: An array of all the contact's organizations. (ContactOrganization[])
 birthday: The birthday of the contact. (Date)
 note: A note about the contact. (DOMString)
 photos: An array of the contact's photos. (ContactField[])
 categories: An array of all the contacts user defined categories. (ContactField[])
 urls: An array of web pages associated to the contact. (ContactField[])
 */