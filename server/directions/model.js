const mongoose = require('mongoose');
const db = require('../../config/connection');

const routeSchema = mongoose.Schema({

  "path": {
    "type": {
      "type": String,
      "default": "LineString"
    },
    "coordinates": [[Number]]
  },
  "total_distance": Number,
  "total_time": Number,
  'status': String,
  'token': {type: String, index: true}

});

mongoose.model('routes', routeSchema);

db.collection('routes').createIndex({token: 1}, {unique: true}); // create index for token if it doesn't exist yet