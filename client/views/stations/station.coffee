Template.station.helpers
  currentTrackUrl: ->
    Session.set 'seekTime', @currentTrackStartTime
    Session.set 'trackLoaded', false
    Meteor.setTimeout =>
      Session.set 'trackLoaded', true
    , 2000
    if this.queue?.length > 0
      return "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + @queue[0].id + "&amp;auto_play=true&amp;hide_related=true&amp;visual=true&amp;show_comments=false&amp;show_playcount=true&amp;buying=false&amp;sharing=false&amp;download=true";

Template.station.rendered = ->
  # why is this.data null???
  console.log this
  Meteor.setTimeout =>
    try
      iframe = document.querySelector '.iframe'
      widget = SC.Widget iframe
      console.log this
      #currentTrackStartTime = this.data.currentTrackStartTime;
      widget.bind SC.Widget.Events.PLAY_PROGRESS, (event) =>
        startTimeDelta = Date.now() - this.data.currentTrackStartTime;
        # set arbitrary threshold for seeking, 10 seconds? 
        console.log 'delta: ',startTimeDelta
        if startTimeDelta > 10000
          widget.seekTo startTimeDelta
        this.unbind SC.Widget.Events.PLAY_PROGRESS
    catch error
      console.log error
      console.log 'fail'
  , 3000