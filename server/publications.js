/* Publications */

// stations for user
Meteor.publish('stations', function() {
  return Stations.find({});
});