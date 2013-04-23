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

if(!window.Store){
    window.Store = {};

    var i = 100;
    window.Store.items = {};
    while(i--){
        window.Store.items['id'+i] = {
            'name' : 'Store Name',
            'id' : i,
            'date' : new Date()
        }
    };

    /*
    *  readonly attribute unsigned long length;
     [IndexGetter] DOMString key(in unsigned long index);
     [NameGetter] DOMString getItem(in DOMString key);
     [NameSetter] void setItem(in DOMString key, in DOMString data);
     [NameDeleter] void removeItem(in DOMString key);
     void clear();
    * */

    window.Store.local = window.localStorage;
}

if (!window.ViewController) window.ViewController = {};


ViewController.Item = new Class({
    Extends: Moobile.ViewController,

    loadView: function(){
        this.view = Moobile.View.at('templates/views/item-view.html');
    }
});

ViewController.Test = new Class({
    Extends: Moobile.ViewController,

    testButton : null,
    list: null,

    loadView: function(){
        this.view = Moobile.ScrollView.at('templates/views/test-view.html');
    },

    viewDidLoad: function(){
        this.parent();

        var items = window.Store.items;

        this.backButton = this.view.getDescendantComponent('back-button');
        this.backButton.addEvent('tap', this.bound('onBackButtonTap'));

        //this.list = new Moobile.List();
        this.list = this.view.getChildComponentOfType(Moobile.List, 'item-list');
        this.list.setSelectable(true);

        for(var item in items){
            if (items.hasOwnProperty(item)) {
                var i = items[item];

                var listItem = new Moobile.ListItem(null, {
                    styleName: 'checked'
                }, 'list-item' + i['id']);
                if(i['id'] % 10 === 0){
                    var title = new Moobile.ListItem();
                    title.setStyle('header');
                    title.setLabel(i['id']);
                    this.list.addItem(title, 'top');
                }
                listItem.setLabel(i['name']);
                listItem.setDetail(item);
                this.list.addItem(listItem, 'top');
            }
        }

        this.view.addChildComponent(this.list);

        this.list.addEvent('select', this.bound('onListSelect'));
        this.list.clearSelectedItem();
        console.log(this.list.isSelectable(), this.list.getSelectedItemIndex());
    },

    destroy: function() {
        this.backButton.removeEvent('tap', this.bound('onBackButtonTap'));
        this.backButton = null;

        this.list.removeEvent('select', this.bound('onListSelect'));
        this.list = null;
        this.parent();
    },

    onBackButtonTap: function(e, sender){
        var alert = new Moobile.Alert();
        alert.setTitle('Hi');
        alert.setMessage('Welcome to Moobile!');
        alert.showAnimated();
        this.getViewControllerStack().popViewController();
    },

    onListSelect: function(item){

        console.log('onListSelect', item);
        var name = item.getName();
        if (name) {
            this.getViewControllerStack().pushViewController(new ViewController.Component.List.Style({style: name}), new Moobile.ViewTransition.Slide);
        }
    }
});

ViewController.Home = new Class({

	Extends: Moobile.ViewController,

	helloButton: null,

    slider: null,
    sliderDisplay: null,
    sliderTarget: null,

    loadingButton: null,
    loadingIndicator: null,

    loading: false,

	loadView: function() {
		this.view = Moobile.View.at('templates/views/home-view.html');
	},

	viewDidLoad: function() {
		this.parent();
        this.helloButton = this.view.getChildComponent('hello-button');
        this.helloButton.addEvent('tap', this.bound('onHelloButtonTap'));

        this.loadingButton = new Moobile.Button();
        this.loadingButton.setLabel('toggle indicator');
        this.loadingButton.addEvent('tap', this.bound('onLoadingButtonTap'));
        this.loadingIndicator = new Moobile.ActivityIndicator();

        this.sliderDisplay = new Moobile.Text();
        this.sliderTarget = new Moobile.Image(null, {
            preload: true
        });
        this.sliderTarget.setSource('http://placehold.it/200x200');

        this.slider = new Moobile.Slider(null, {
            value: 180,
            minimum: 0,
            maximum: 360
        });
        this.slider.addEvent('change', this.bound('onSliderChanged'));

        this.view.addChildComponent(this.slider);
        this.view.addChildComponent(this.sliderTarget);
        this.view.addChildComponent(this.sliderDisplay);

        this.view.addChildComponent(this.loadingIndicator);
        this.view.addChildComponent(this.loadingButton);
	},

	destroy: function() {
		this.helloButton.removeEvent('tap', this.bound('onHelloButtonTap'));
		this.helloButton = this.view.getChildComponent('hello-button');
		this.parent();
	},

    onSliderChanged: function(e, sender){
        this.sliderDisplay.setText('slider.value = ' + e);
        this.sliderTarget.element.setStyles({
            'transform' : 'rotate(' + (e|e) + 'deg)'
        });
    },

    onLoadingButtonTap: function(e, sender) {
        this.loading = !this.loading;
        if(this.loading){
            this.loadingIndicator.start();
        }else{
            this.loadingIndicator.stop();
        }
    },

    onHelloButtonTap: function(e, sender) {
        this.getViewControllerStack().pushViewController(new ViewController.Test, new Moobile.ViewTransition.Slide);
    }

});
