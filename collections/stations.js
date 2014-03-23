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
  StationForm = new AutoForm(Stations);
  TrackForm = new AutoForm(TrackSchema);
  Meteor.startup(function() {
    StationForm.hooks({
      before: {
        insert: function (doc) {
          //modify doc
          return doc;
        }
      },
      after: {
        insert: function(error, result, template) {
          if (error) {
            console.log(error);
            alertMessage(error.message, "danger");
          }
          else {
            // do some things 
          }
        },
        update: function(error, result, template) {
          if (error) {
            console.log(error);
            alertMessage(error.message, "danger");
          }
          else {
            // do some things
          }
        }
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
  createstation: function(stationAttributes){
    var user = Meteor.user();
    
    // ensure the user is logged in
    if (!user) {
      throw new Meteor.Error(401, "You need to login to create new station.");
    }
    
    // check for title and description
    if (!stationAttributes.name) {
      throw new Meteor.Error(422, "You need a station name.");
    }
    
    // pick out the whitelisted keys
    var station = _.extend(_.pick(stationAttributes, 'name'), 
                           {
                             userId: user._id,
                             owner: user.username,
                             created: new Date().getTime()
                           });
    
    if (can.createstation()) {
      var stationId = stations.insert(station);
      return stationId;
    }
  },
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
