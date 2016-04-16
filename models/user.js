var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  uid: {
    type: String,   // User ID
    unique: true
  },
  displayName: {
    type: String    // display name
  }
}, {
  // define this collection's name explicitly
  collection: "users"
});

module.exports = mongoose.model('User', User);
