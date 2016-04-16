var app = require('./app');
var server = require('http').Server(app);
var xssFilters = require('xss-filters');
var io = require('socket.io').listen(server);
var mongoose = require('mongoose');
var Chat = require('./models/chat.js');

// mongoose
var conn2 = mongoose.createConnection('mongodb://localhost/chat-contents');
var Chat = conn2.model('Chat');

/**
* socket.io
**/

function skio() {

  server.listen(app.get('port'), function() {
    console.log('listening!!!');
  });

  io.sockets.on('connection', function (socket) {

    socket.on('msg update', function() {
      Chat.find(function(err, docs) {
        socket.emit('msg open', docs);
      });
    });

    console.log('a user connected');

    socket.on('msg send', function(msg){
      msg = xssFilters.inHTMLData(msg);
      console.log('message: ' + msg);
      io.emit('msg push', msg);
      socket.broadcast.emit('msg push', msg);
      // Resisration to DB
      var chat = new Chat();
      chat.message = msg;
      chat.date = new Date();
      chat.name = app.locals.name;
      chat.save(function(err) {
        if (err) { console.log(err); }
      });
    });

    // Delete messages in DB
    socket.on('deleteDB', function() {
      socket.emit('db drop');
      socket.broadcast.emit('db drop');
      Chat.find().remove();
    });

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

  });
}

module.exports = skio;
