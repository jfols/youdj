Router.configure
  layoutTemplate: 'layout'
  loadingTemplate: 'loading'

@RouteCtrl =
  station: RouteController.extend
    waitOn: -> Meteor.subscribe 'station', @params._id
    data: -> { station: Stations.findOne() }

Router.map ->
  ### pages ###
  @route 'home', path: '/'
  @route 'createStation', path: 'station/create'
  
  ### stations ###
  @route 'browseStations',
    waitOn: -> Meteor.subscribe 'stations'
    data: -> { stations: Stations.find() }
  
  @route 'station',
    path: '/station/:_id'
    controller: RouteCtrl.station
  
  @route 'userStations',
    path: '/stations/:username'
    waitOn: -> Meteor.subscribe 'userStations', @params.username
    data: -> { stations: Stations.find(username: @params.username)}
  
  @route 'djStation',
    path: '/djStation/:_id',
    waitOn: -> Meteor.subscribe 'djStation', @params._id
    data: -> { station: Stations.findOne() }
    
Router.onBeforeAction -> Session.set 'routeParamId', @params._id 