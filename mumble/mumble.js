var request = require('request');
var friends = require("../../core/friends");
var logger = require('../../core/logger.js');
var fs = require('fs');

exports.compatible = '2.0.*';

var mumbleApi = "";
if (fs.existsSync('./bot_modules/mumble/mumbleinfo')) {
  mumbleApi = fs.readFileSync('./bot_modules/mumble/mumbleinfo', 'utf8');
} else {
  logger.error('Mumble config not found!');
}


// Handler.
exports.handle = function(input, source) {
  input = input.split(" ");
  if (input[0] == "mumble") {
    request(mumbleApi, function (err, resp, body) {
      if (!err && resp.statusCode == 200) {
        var mumbleInfo = JSON.parse(body);
        var message = "Here is the current status of mumble:\n" + getUserList(mumbleInfo.root);
        friends.messageUser(source, message);
      }
    });

    return true;
  }
}


exports.onExit = function() {
  // Empty!
}


exports.getHelp = function() {
  return "MUMBLE\n" +
  "mumble - See who is currently in Mumble\n";
}


// Parses mumble JSON for user list.
function getUserList(mumble) {

  var userInfo = "";

  // Add channel name.
  userInfo += mumble.name + "\n";

  // Add users from channel.
  for (var i = 0; i < mumble.users.length; i++) {
    userInfo += "|-> " + mumble.users[i].name + "\n";
  }

  // Call recursively on subchannels.
  if (mumble.channels.length > 0) {

    // For each channel, call recursively.
    for (var i = 0; i < mumble.channels.length; i++) {
      userInfo += getUserList(mumble.channels[i]);
    }
  }

  return userInfo;
}

var isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
}
