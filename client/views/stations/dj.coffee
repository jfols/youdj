Template.djStation.helpers
  searchResultsTracks: -> Session.get 'searchResultsTracks'
  currentTrackUrl: ->
    if this.station?.queue?.length > 0
      return "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + this.station.queue[0].id + "&amp;auto_play=true&amp;hide_related=true&amp;visual=true&amp;show_comments=false&amp;show_playcount=true&amp;buying=false&amp;sharing=false&amp;download=true"
      
Template.djStation.rendered = ->
  console.log this
  try
    SC.initialize client_id: Soundcloud.client_id
  catch error
    console.log 'Error: Soundcloud client_id is not configured, please see README: '+error.message
  console.log this
  Session.set 'station', this.station
  Meteor.setTimeout =>
    widget = SC.Widget 'iframeDJSC'
    console.log Session.get 'routeParamId'
    stationId = Session.get 'routeParamId'
    widget.bind SC.Widget.Events.FINISH, (event) => 
      # pop the queue!
      console.log 'popQueue ', stationId
      Meteor.call 'popQueue', stationId, new Date()
    widget.bind SC.Widget.Events.SEEK, (event) =>
      effectiveStartTime = new Date(Date.now() - event.currentPosition)
      console.log 'effective start time: ', effectiveStartTime
      Meteor.call 'setCurrentTrackStartTime', effectiveStartTime
  , 3000

songFinished = (event) ->
  # pop the queue!
  Meteor.call 'popQueue', this.station._id

Template.djStation.events
  'click .skip': (event) ->
    event.preventDefault()
    console.log 'popQueue ', Session.get 'routeParamId'
    Meteor.call 'popQueue', Session.get 'routeParamId', new Date()
    
  'click .search': (event) ->
    event.preventDefault()
    searchQuery = document.getElementById('searchQuery').value
    SC.get '/tracks', { q: searchQuery, limit: 50 }, (tracks) -> Session.set 'searchResultsTracks', tracks