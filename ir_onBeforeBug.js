Item = new Meteor.Collection('items');
Owner = new Meteor.Collection('owner');

if (Meteor.isClient) {
  Router.configure({
    layoutTemplate: 'layout'
  })
  Router.map(function(){
    this.route('home', {
      path: '/',
      onBeforeAction: function(pause){
        this.subscribe('owner').wait();
        if(!this.ready()){
          return pause();
        }
        this.subscribe('items', {owners: _.pluck(Owner.find().fetch(), '_id')}).wait();
        console.log('ready', this.ready());
        if(!this.ready())
          return pause();
      }
    })
  });

  Template.home.helpers({
    item: Item.find()
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Item.remove({});
  Owner.remove({});

  o1 = Owner.insert({name: 'M'})

  i1 = Item.insert({name: 'pen', owner: o1});
  i2 = Item.insert({name: 'fork', owner: o1});

  Meteor.publish('owner', function(options){
    return Owner.find();
  });

  Meteor.publish('items', function(options){
    return Item.find({owner: {$in: options.owners} });
  })
}
