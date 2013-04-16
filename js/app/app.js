"use strict"

window.onerror = function(message, url, lineNumber) {
    console.log("Error: "+message+" in "+url+" at line "+lineNumber);
}

//List Product

/* Device check
   - "Android"
   - "BlackBerry"
   - "iPhone"
   - "webOS"
   - "WinCE"
*/
var App = Ember.Application.create();
App.deferReadiness();

App.cfg = {
    device: 'Android',
    routes: {
        'index' : {
            title: 'Home',
            icon: '&#8962;'
        },
        'photo' : {
            icon : '&#128247;',
            title: 'Fotos'
        },
        'clock' : {
            icon : '&#128340;',
            title: 'Uhr'
        },
        'compass' : {
            icon : '&#59176;',
            title: 'Kompass'
        },
        'notify' : {
            icon : '&#9889;',
            title : 'Notify'
        }
    }
};

document.addEventListener("deviceready", function(){
    App.cfg.device = device.platform || 'desktop';
    $('body').addClass(App.cfg.device);

    App.advanceReadiness();
}, false);

/*
$(document).ready(function(){
    if(typeof device === "undefined"){
        console.error('remove dom ready event!');
        $('body').addClass(App.cfg.device);
    }
});
*/




Ember.View.reopen({
    didInsertElement: function() {
        this.set('elementIsInserted', true);
        this._super();
    },

    willDestroyElement: function() {
        this.set('elementIsInserted', false);
        this._super();
    }
});

App.Router.reopen({
    location: 'hash'
})

App.Router.map(function() {
    this.route('photo');
    this.route('clock');
    this.route('compass');
    this.route('notify');
    //this.route('accel');
});

App.LoadingView = Ember.View.extend({
    hidden: false,
    viewName: 'loadingView',
    templateName: 'loading',
    tagName: 'div',
    classNames: ['loading'],
    didInsertElement: function(){
        var height = window.innerHeight;
        this.$().css({
            'height' : height
        }).find('.loading-animation').css({
            'height' : height
        })
    },
    _hideViewChanged: function() {
        if (this.get('hidden')) {
            this.hide();
        }
    }.observes('hidden'),
    hide: function(){
        var that = this;
        if(App.cfg.device === 'iOS'){
            //use fadeOut for better performance
            this.$().fadeOut("slow", function() {
                console.log('finished sliding');
                that.set('isVisible', false);
            });
        }else{
            this.$().slideUp("slow", function() {
                console.log('finished sliding');
                that.set('isVisible', false);
            });
        }
    }
});

App.ApplicationView = Ember.View.extend({
    didInsertElement : function(){
        var that = this;

        console.log('application inserted');
        //wenn windows phone, dann absolute umwandeln
        if(App.cfg.device){
            setTimeout(function(){
                console.log('WinCE inserted ApplicationView');
                var width = window.innerWidth,
                    height= window.innerHeight;

                var $header = $('.header'),
                    $outlet = $('#outlet'),
                    $footer = $('.bottomMenu');

                if(!$header.length){
                    $header = $('.actionBar');
                }

                var newHeight = height - ($header.outerHeight() + $footer.outerHeight());

                console.log('window', height, 'header', $header.outerHeight(), 'footer', $footer.outerHeight());
                console.log('newHeight', newHeight);
                $outlet.css({
                    'height': newHeight
                });

                var loadingView = that.get('loadingView');

                loadingView.set('hidden', true);


            }, 2000);

        }


    }
});
App.ApplicationController = Ember.Controller.extend({
    needs: ['actionBar'],
    title: '',
    _updateTitle: function() {
        var path = this.get('currentPath');
        var route = App.cfg.routes[path];

        var title = route.title ? route.title : 'nop';

        this.set('title', title);
        this.set('controllers.actionBar.title', title);
    }.observes('currentPath')
});
App.ApplicationRoute = Ember.Route.extend({
    setupController: function(controller, model){

    },
    events: {
        goToLink: function(link){
            //console.log('goToLink', link);
            this.transitionTo(link);
        }
    }
})

App.IndexRoute = Ember.Route.extend({
    /*redirect: function(){
     this.transitionTo('lists');
     }*/
});

App.ListsRoute = Ember.Route.extend({
    setupController: function(controller, song) {
        controller.set('photo', App.Photo.find(1));
    },
    model: function(){
        return App.List.find();
    }
});

App.PhotoController = Ember.ObjectController.extend({
    title: 'Fotos',
    content: null,
    logo: "img/cordova.png",
    takePicture: function(){
        var that = this;
        var cameraSuccess = function(imageURI){
            //console.log('cameraSuccess');
            //console.log( imageURI);
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
            //console.log('error ', msg);
        };

        //console.log('takePicture');
        //console.log(navigator.camera);
        navigator.camera.getPicture( cameraSuccess, cameraError, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI
        });
    },
    submitFileUpload: function(){
        //console.log('submitFileUpload');
        var person = App.Photo.createRecord({
            username: 'phonegap',
            attachment: this.get('logo')
        });
        //console.log(person);
        person.get('transaction').commit();
    }
});


App.ActionBarController = Ember.ObjectController.extend({
    title: 'phonegap',
    navigations: function(){
        var names = App.Router.router.recognizer.names;
        var navs = [];
        for(var name in names){
            if (names.hasOwnProperty(name)) {
                var nav = new Ember.Object();
                nav.set('name', name);
                //console.log('found', name);
                navs.push(nav);
            }
        }
        //console.log(navs);
        return navs;
    }.property('App.Router.router.recognizer.names')
});
App.ActionBarBackView = Ember.View.extend({
    templateName: 'actionBarBack',
    tagName: 'span',
    classNames: ['back', 'ui-button'],
    click: function(e){
        e.preventDefault();
        //console.log('click');
        setTimeout(function(){
            window.history.back();
        }, 10);
    }
});
App.ActionBarMenuView = Ember.View.extend({
    templateName: 'actionBarMenu',
    tagName: 'span',
    classNames: ['menu'],
    expanded: false,
    touchStart: function(e){
        var that = this;
        if(e.target.nodeName === "SPAN" || e.target.nodeName === "P"){
            //hat den toggle button getroffen
            this.toggleProperty('expanded');
        }else{
            /*setTimeout(function(){
                that.toggleProperty('expanded');
            }, 400);*/
        }
        //console.log(e);
    }
});
App.ActionBarControlView = Ember.View.extend({
    templateName: 'actionBarControl',
    tagName: 'ul',
    classNames: ['control']
});

App.ActionBarView = Ember.ContainerView.extend({
    /**
     * Android ActionBar clone
     * back
     * dropdown
     * buttons
     **/
    childViews: [App.ActionBarBackView, App.ActionBarMenuView, App.ActionBarControlView],
    controller: App.ActionBarController,
    tagName: 'div',
    classNames: ['actionBar'],
    templateName: 'actionBar'
});

App.ClockDigitDisplayView = Ember.View.extend({
    hour: 0,
    minute: 0,
    second: 0,
    templateName: 'clockDigitDisplay',
    tagName: 'div',
    classNames: ['clock-display'],
    timeChanged: function(){
        var time = this.get('controller.time');

        var h = Math.floor(time / 3600),
            m = Math.floor((time / 60) % 60),
            s = time % 60;

        this.set('hour', h);
        this.set('minute', m);
        this.set('second', s);
    }.observes('controller.time')
});
App.ClockView = Ember.View.extend({

});
App.ClockController = Ember.ObjectController.extend({
    time: 0,
    running: false,
    stop: function(){
        //console.log('stopping timer');
        this.set('running', false);
    },
    start: function(){
        var that = this;
        var run = function(){
           setTimeout(function(){
               var running = that.get('running');
               if(running){
                   that.incrementProperty('time');
                   run();
               }
           }, 1000);
        };
        //console.log('starting timer');
        that.set('running', true);
        run();
    }
});

App.BottomMenuView = Ember.View.extend({
    templateName: 'bottomMenu',
    tagName: 'div',
    classNames: ['bottomMenu']
});
App.BottomMenuController = Ember.ObjectController.extend({
    navigations: function(){
        var names = App.Router.router.recognizer.names;
        var navs = [];
        for(var name in names){
            if (names.hasOwnProperty(name)) {
                //console.log('found', name);
                var nav = new Ember.Object();
                nav.set('name', name);
                navs.push(nav);
            }
        }
        console.log(navs);
        return navs;
    }.property('App.Router.router.recognizer.names')
})



App.CompassView = Ember.View.extend({
    templateName: 'compass',
    willDestroyElement: function(){
        this.get('controller').send('unbindCompass');
    },
    willInsertElement: function(){
        this.get('controller').send('bindCompass');
    },
    updateRotation: function(){
        if(this.get('elementIsInserted')){
            var degrees = this.get('controller.degrees');
            this.$().css({
                'transform':'rotate(' + degrees + 'deg)'
            });
        }
    }.observes('controller.degrees')
});
App.CompassController = Ember.ObjectController.extend({
    degrees: 0,
    watchId: 0,
    unbindCompass: function(){
        var watchId = this.get('watchId');
        navigator.compass.clearWatch(watchId);
    },
    bindCompass: function(){
        var that = this;
        var compassSuccess = function(heading){
                //console.log('heading ' + heading.magneticHeading);
                that.set('degrees', heading.magneticHeading);
            },
            compassError = function(err){
                //console.log('compass error: ' + err.code);
            };

        var cfg = {
            frequency: 1000
        }

        var watchId = navigator.compass.watchHeading(compassSuccess, compassError, cfg);
        this.set('watchId', watchId);
    }
});

App.NotifyController = Ember.ObjectController.extend({
   fireNotification : function(){
       navigator.notification.vibrate(1000);
       navigator.notification.alert("WASD", function(){
           //console.log('alert callback');
       });
   }
});

/*
App.AccelView = Ember.View.extend({
    templateName: 'accel',
    willDestroyElement: function(){
        this.get('controller').send('unbindAccel');
    },
    willInsertElement: function(){
        this.get('controller').send('bindAccel');
    }
});
App.AccelController = Ember.ObjectController.extend({
    watchId: '',
    accel: {x:'0',y:'0',z:'0',timestamp:''},
    bindAccel: function(){
        var that = this;

        var onSuccess = function (acceleration) {
            that.set('accel', acceleration);
        };
        var onError = function(){
            alert('onError!');
        };
        var options = { frequency: 1000 };  // Update every 3 seconds
        var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
        this.set('watchId', watchID);
    },
    unbindAccel: function(){
        var watchId = this.get('watchId');
        navigator.accelerometer.clearWatch(watchId);
    }
});
*/

Ember.Handlebars.registerBoundHelper('round', function(val){
    val = '' + val;
    return val.substring(0,3);
});
Handlebars.registerHelper('ifCond', function(v1, v2, options) {
    console.log('ifCond', v1, v2);
    if(v1 == v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

Handlebars.registerHelper('cfgCondTrue', function(v1, v2, options) {
    if(App.cfg[v1] == v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

Handlebars.registerHelper('cfgCondFalse', function(v1, v2, options) {
    if(App.cfg[v1] != v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

Ember.Handlebars.registerBoundHelper('routeIcon', function(item){
    var val = item.get('name');
    var route = App.cfg.routes[val];
    var icon = route ? route.icon ? route.icon : '&#128683;': '&#128683;';
    return new Handlebars.SafeString("" + icon);;
});
Ember.Handlebars.registerBoundHelper('routeName', function(item){
    var val = item.get('name');
    var route = App.cfg.routes[val];
    var title = route ? route.title ? route.title : '&#128683;': '&#128683;';
    return new Handlebars.SafeString("" + title);;
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
