"use strict"


//List Product

// Router
var App = Ember.Application.create();

App.IndexRoute = Ember.Route.extend({
    /*redirect: function(){
        this.transitionTo('lists');
    }*/
});

App.Router.map(function() {
    this.resource('lists');
    this.resource('list', { path: '/list/:list_id' });
});


App.ListsRoute = Ember.Route.extend({
    setupController: function(controller, song) {
        controller.set('photo', App.Photo.find(1));
    },
    model: function(){
        return App.List.find();
    }
});

App.ListsController = Ember.ArrayController.extend({
});

App.WallController = Ember.ObjectController.extend({
    content: null,
    logo: "img/cordova.png",
    takePicture: function(){
        var that = this;
        var cameraSuccess = function(imageURI){
            console.log('cameraSuccess');
            console.log( imageURI);
            that.set('logo', imageURI);

            /*
            var person = App.Photo.createRecord({
                username: 'phonegap',
                attachment: photo
            });
            person.get('transaction').commit();
            */
        };
        var cameraError = function(msg){
            console.log('error ', msg);
        };

        console.log('takePicture');
        console.log(navigator.camera);
        navigator.camera.getPicture( cameraSuccess, cameraError, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI
        });
    },
    submitFileUpload: function(){
        console.log('submitFileUpload');
        var person = App.Photo.createRecord({
            username: 'phonegap',
            attachment: this.get('logo')
        });
        console.log(person);
        person.get('transaction').commit();
    }
});


/*
App.UploadFileView = Ember.TextField.extend({
    type: 'file',
    attributeBindings: ['name'],
    change: function(evt) {
        var self = this;
        var input = evt.target;
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            var that = this;
            reader.onload = function(e) {
                var fileToUpload = e.srcElement.result;
                self.get('controller').set(self.get('name'), fileToUpload);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
});   */

App.UploadController = Ember.ObjectController.extend({

});
App.UploadView = Ember.View.create({
    templateName: 'upload'
});