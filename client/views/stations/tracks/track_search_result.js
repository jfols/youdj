Template.trackSearchResult.events({
  'click .pushQueue': function (event) {
    event.preventDefault();
    Meteor.call('queueTrack', Session.get('routeParamId'), this); // stationId, track
  }
});