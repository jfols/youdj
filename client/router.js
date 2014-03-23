Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.map( function () {
  /* pages */
  this.route('home', {
    path: '/'
  });
  
  this.route('about', {
    path: 'about'
  });
  
  this.route('createStation', {
    path: 'station/create'
  });
  
  /* stations */
  this.route('browseStations', {
    waitOn: function () {
      Meteor.subscribe('stations')
    },
    data: function () {
      return { stations: Stations.find({}) };
    }
  });
  
  this.route('station', {
    path: '/station/:_id',
    waitOn: function () {
      return Meteor.subscribe('station', this.params._id);
    },
    data: function () { 
      return Stations.findOne();
    }
  });
  
});