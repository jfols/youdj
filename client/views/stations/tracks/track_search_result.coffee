Template.trackSearchResult.events
  'click .pushQueue': (event) ->
    Meteor.call 'queueTrack', Session.get('routeParamId'), this