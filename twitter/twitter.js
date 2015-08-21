var Twit = require('twit');
var fs = require("fs");

var config;
var T;
if (fs.existsSync("./data/tweet.json")) {
  config = JSON.parse(fs.readFileSync("./data/tweet.json"));
  T = new Twit({
      consumer_key:         config.consumer_key
    , consumer_secret:      config.consumer_secret
    , access_token:         config.access_token
    , access_token_secret:  config.access_token_secret
  });
}

// Import Jankbot API modules.
var friends = require("../../core/friends");
var logger = require('../../core/logger.js');

exports.handle = function(input, source) {

  var tweetConfig = config;
  input = input.split(" ");
  if (input[0] == "tweet") {

    if (!tweetConfig) {
      friends.messageUser(source, "The twitter module is missing data/tweet.json. Please see the README");
      return true;
    }

    if (tweetConfig.allowed.indexOf(source) == -1) {
      friends.messageUser(source, "You do not have the permissions to use this module.");
      return true;
    }

    // Parse the input and decide what to do.
    input.splice(0, 1);
    var content = input.join(" ");

    if (content.length > 140) {
      friends.messageUser(source, "Message was >140 characters. Not tweeted.");
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

