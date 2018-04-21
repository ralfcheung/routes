var mongoose = require('mongoose');
var dbConnection = require('../../config/connection');

var routeSchema = mongoose.Schema({

  "path": {
    "type": {
      "type": String,
      "default": "LineString"
    },
    "coordinates": [[Number]]
  },
  "total_distance": Number,
  "total_time": Number,
  'id': String,
  'status': String,
  'token': String

});

module.exports = dbConnection.model('routes', routeSchema);
