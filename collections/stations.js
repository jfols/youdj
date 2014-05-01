/* Stations collection */

/* helper schemas */
TrackSchema = new SimpleSchema({
  trackId: {
    type: Number
  },
  urlSC: {
    type: String,
    max: 200
  }
});

Stations = new Meteor.Collection('stations', {
  schema: new SimpleSchema({
    ownerUserId: {
      type: String,
      autoValue: function () {
        if (this.isInsert) {
          return Meteor.userId();
        }
        else {
          return this.unset();
        }
      },
      optional: true,
      denyUpdate: true
    },
    username: {
      type: String,
      autoValue: function () {
        if (this.isInsert) {
          return Meteor.user().username;
        }
        else {
          return this.unset();
        }
      },
      optional: true,
      denyUpdate: true
    },
    name: {
      type: String,
      label: "Station Name",
      min: 4,
      max: 200
    },
    numListeners: {
      type: Number,
      autoValue: function() {
        if (this.isSet && !this.isInsert) return this.value;
        else return 0;
      },
      optional: true
    },
    currentTrackStartTime: {
      type: Date,
      optional: true
    },
    queue: {
      type: [Object],
      optional: true,
      blackbox: true //TODO: create TrackSchema, pick properties out of SC track object
    }
  })
});

if (Meteor.isClient) {
  Meteor.startup(function() {
    AutoForm.addHooks(['createStationForm'], {
      onError: function (operation, error, template) {
        console.log(error);
        alertMessage(error.message, "danger");
      }
    });
  });
}

/* owner of station can insert/update/remove */
Stations.allow({
  insert: function(userId, doc){
    return true; //can.createStation(userId);
  },
  update:  function(userId, doc, fieldNames, modifier){
    return true; //can.editStation(userId, doc);
  },
  remove:  function(userId, doc){
    return true //can.removeStation(userId, doc);
  }
});

// Methods

Meteor.methods({
  queueTrack: function (stationId, track) {
    var station = Stations.findOne(stationId);
    if (can.editStation(station)) {
      Stations.update(stationId, { $push: {queue: track} }, {validate: false});
    }
  },
  popQueue: function (stationId, currentTrackStartTime) {
    var station = Stations.findOne(stationId);
    if (can.editStation(station)) {
      Stations.update(stationId, { $pop: { queue: -1 }, $set: { currentTrackStartTime: currentTrackStartTime } });
    }
  },
  setCurrentTrackStartTime: function (stationId, currentTrackStartTime) {
    var station = Stations.findOne(stationId);
    if (can.editStation(station)) {
      Stations.update(stationId, { currentTrackStartTime: currentTrackStartTime });
    }
  }
});
