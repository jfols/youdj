/* Publications */

/* all stations */
Meteor.publish('stations', function() {
  return Stations.find({});
});

/* user stations */
Meteor.publish('userStations', function(username) {
  return Stations.find({username: username});
});

/* single station */
Meteor.publish('station', function(id) {
  return Stations.find(id);
});

//* dj station */
Meteor.publish('djStation', function(id) {
  return Stations.find({_id: id, ownerUserId: this.userId });
});