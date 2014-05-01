Template.station.helpers({
  currentTrackUrl: function () {
    if (this.queue && this.queue.length > 0)
    {
      return "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + 
        this.queue[0].id +
        "&amp;auto_play=true&amp;hide_related=true&amp;visual=true&amp;show_comments=false&amp;show_playcount=true&amp;buying=false&amp;sharing=false&amp;download=true";
    }
  }
});

Template.station.rendered = function () {
    /* hax...wait a couple seconds for track to load */
  Meteor.setTimeout(function () {
    console.log('in timeout function');
    try {
      var iframe = document.querySelector('.iframe');
      var widget = SC.Widget(iframe);
      console.log(this);
      var currentTrackStartTime = this.data.currentTrackStartTime;
      
      widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(event) {
        var startTimeDelta = Date.now() - currentTrackStartTime;
        /* set arbitrary threshold for seeking, 10 seconds? */
        console.log('delta: ',startTimeDelta);
        if (startTimeDelta > 10000) {
          widget.seekTo(startTimeDelta);
        }
        this.unbind(SC.Widget.Events.PLAY_PROGRESS);
      });
      console.log('did it');
    }
    catch (error) {
      console.log(error);
      console.log('fail');
    }
  }, 3000);
};