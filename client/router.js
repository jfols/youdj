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
  
  this.route('userStations', {
    path: '/stations/:username',
    waitOn: function () {
      Meteor.subscribe('userStations', this.params.username);
    },
    data: function () {
      return { stations: Stations.find({username: this.params.username}) };
    }
  });
  
  this.route('djStation', {
    path: '/djStation/:_id',
    waitOn: function () {
      Meteor.subscribe('djStation', this.params._id);
    },
    data: function () {
      return  { station: Stations.findOne() };
    }
  });
});

Router.before(function() { Session.set('routeParamId', this.params._id); });