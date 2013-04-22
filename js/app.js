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
		var alert = new Moobile.Alert();
		alert.setTitle('Hi');
		alert.setMessage('Welcome to Moobile!');
		alert.showAnimated();
	}

});
