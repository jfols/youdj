Template.userStations.helpers
  username: -> Router.current().params.username

Template.userStations.rendered = ->
  console.log this