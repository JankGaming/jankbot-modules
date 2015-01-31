var Twit = require('twit');
var fs = require("fs");

exports.compatible = '2.0.*';

var config = require('./tweet.json');

var T = new Twit({
    consumer_key:         config.consumer_key
  , consumer_secret:      config.consumer_secret
  , access_token:         config.access_token
  , access_token_secret:  config.access_token_secret
});

// Import Jankbot API modules.
var friends = require("../../core/friends");
var logger = require('../../core/logger.js');

exports.handle = function(input, source) {
  var tweetConfig = config;
  input = input.split(" ");
  if (input[0] == "tweet") {

    if (tweetConfig.allowed.indexOf(source) == -1) {
      friends.messageUser(source, "You do not have the permissions to use this module.");
      return;
    }

    // Parse the input and decide what to do.
    input.splice(0, 1);
    var content = input.join(" ");

    if (content.length > 140) {
      friends.messageUser(source, "Toooo long! (Can you feeeel iiiiit?)");
      return;
    } else {
      T.post('statuses/update', {status: content}, function(err, reply) {
        if (err) throw err;
        friends.messageUser(source, "Tweeted!");
      });
    }

    return true;
  }
}

exports.onExit = function() {
}

