Template.djStation.helpers({
  schema: function () {
    return StationForm;
  },
  searchResultsTracks: function () {
    return Session.get('searchResultsTracks');
  },
  currentTrackUrl: function () {
    if (this.station && this.station.queue && this.station.queue.length > 0)
    {
      return "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + 
        this.station.queue[0].id +
        "&amp;auto_play=true&amp;hide_related=true&amp;visual=true&amp;show_comments=false&amp;show_playcount=true&amp;buying=false&amp;sharing=false&amp;download=true";
    }
  }
});

Template.djStation.rendered = function () {
  try {
    SC.initialize({
      client_id: Soundcloud.client_id
    });
  } catch (error) {
    console.log('Error: Soundcloud client_id is not configured, please see README: '+error.message);
  }
  var iframe = document.querySelector('.iframe');
  var widget = SC.Widget(iframe);
  if (this.data.station) {
    var stationId = this.data.station._id;
    widget.bind(SC.Widget.Events.FINISH, function(event) { 
      /* pop the queue! */
      console.log('popQueue ', stationId);
      Meteor.call('popQueue', stationId, new Date());
    });
    /* TODO: this causes the entire template to reload, try with new Meteor UI 
  widget.bind(SC.Widget.Events.SEEK, function(event) {
    var effectiveStartTime = new Date(Date.now() - event.currentPosition);
    console.log('effective start time: ', effectiveStartTime);
    Meteor.call('setCurrentTrackStartTime', effectiveStartTime);
  });
  */
  }
};

var songFinished = function(event) {
  /* pop the queue! */
  Meteor.call('popQueue', this.station._id);
};

Template.djStation.events({
  'click .search': function (event) {
    event.preventDefault();
    var searchQuery = document.getElementById('searchQuery').value;
    SC.get('/tracks', { q: searchQuery, limit: 50 }, function(tracks) {
      Session.set('searchResultsTracks', tracks);
    });
  }
});