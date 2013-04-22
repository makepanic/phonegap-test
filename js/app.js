/*
---

name: ViewController.Home

description:

license:

authors:
	- Your name

requires:

provides:
	- ViewController.Home

...
*/

if (!window.ViewController) window.ViewController = {};

ViewController.Test = new Class({
    Extends: Moobile.ViewController,

    testButton : null,

    loadView: function(){
        this.view = Moobile.ScrollView.at('templates/views/test-view.html');
    },

    viewDidLoad: function(){
        this.testButton = this.view.getChildComponent('test-button');
        this.testButton.addEvent('tap', this.bound('onTestButtonTap'));
    },

    destroy: function() {
        this.testButton.removeEvent('tap', this.bound('onTestButtonTap'));
        this.testButton = null;
        this.parent();
    },

    onTestButtonTap: function(e, sender){
        var alert = new Moobile.Alert();
        alert.setTitle('Hi');
        alert.setMessage('Welcome to Moobile!');
        alert.showAnimated();
        this.getViewControllerStack().popViewController();
    }
});

ViewController.Home = new Class({

	Extends: Moobile.ViewController,

	helloButton: null,

	loadView: function() {
		this.view = Moobile.View.at('templates/views/home-view.html');
	},

	viewDidLoad: function() {
		this.parent();
		this.helloButton = this.view.getChildComponent('hello-button');
		this.helloButton.addEvent('tap', this.bound('onHelloButtonTap'));
	},

	destroy: function() {
		this.helloButton.removeEvent('tap', this.bound('onHelloButtonTap'));
		this.helloButton = this.view.getChildComponent('hello-button');
		this.parent();
	},

	onHelloButtonTap: function(e, sender) {
        this.getViewControllerStack().pushViewController(new ViewController.Test, new Moobile.ViewTransition.Slide);
	}

});
