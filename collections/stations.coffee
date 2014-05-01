# helper schema
@TrackSchema = new SimpleSchema
  trackId:
    type: Number
  urlSC:
    type: String
    max: 200

@Stations = new Meteor.Collection 'stations',
  schema: new SimpleSchema
    ownerUserId:
      type: String
      autoValue: ->
        if this.isInsert then Meteor.userId()
        else this.unset()
      optional: true,
      denyUpdate: true
    username:
      type: String
      autoValue: ->
        if this.isInsert then Meteor.user().username
        else this.unset()
      optional: true,
      denyUpdate: true
    name:
      type: String
      label: "Station Name"
      min: 4
      max: 200
    numListeners:
      type: Number
      autoValue: ->
        if this.isSet && !this.isInsert then this.value;
        else 0
      optional: true
    currentTrackStartTime:
      type: Date,
      optional: true
    queue:
      type: [Object]
      optional: true
      blackbox: true #TODO: create TrackSchema, pick properties out of SC track object

if Meteor.isClient
  Meteor.startup ->
    AutoForm.addHooks ['createStationForm'],
      onError: (operation, error, template) ->
        console.log error
        alertMessage error.message, "danger"

# owner of station can insert/update/remove 
Stations.allow
  insert: (userId, doc) -> true; #can.createStation userId
  update: (userId, doc, fieldNames, modifier) -> true; #can.editStation userId, doc
  remove: (userId, doc) -> true #can.removeStation userId, doc

Meteor.methods
  queueTrack: (stationId, track) ->
    station = Stations.findOne stationId
    if can.editStation station
      Stations.update { _id: stationId}, { $push: {queue: track} }, {validate: false}
  popQueue: (stationId, currentTrackStartTime) ->
    station = Stations.findOne(stationId);
    if can.editStation station
      Stations.update { _id: stationId }, { $pop: { queue: -1 }, $set: { currentTrackStartTime: currentTrackStartTime } }
  setCurrentTrackStartTime: (stationId, currentTrackStartTime) ->
    station = Stations.findOne stationId
    if can.editStation station
      Stations.update { _id: stationId }, { currentTrackStartTime: currentTrackStartTime }