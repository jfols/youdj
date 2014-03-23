/* collection permissions

if (can.editStation(theStation)){
  // do something  
}

 */

can = {
  createStation: function () {
    return Boolean(Meteor.userId());
  },
  editStation: function (station) {
    return Meteor.userId() === station.ownerUserId;
  },
  removeItem: function (station) {
    return Meteor.userId() === station.ownerUserId;
  }
}