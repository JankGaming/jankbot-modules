var Twit = require('twit');
var fs = require("fs");

var config = require('./tweet.json');

var T = new Twit({
    consumer_key:         config.consumer_key
  , consumer_secret:      config.consumer_secret
  , access_token:         config.access_token
  , access_token_secret:  config.access_token_secret
});




/*
 * jankbotModuleTemplate.js
 * Free and open as a starting point for Jankbot modules.
 * For more help, contact twiterghost@jankdota.com or tweet @JankDota.
 * Jankbot is written in NodeJS and requires version 0.10.0 or above.
 * http://nodejs.org
 */

// Import Jankbot API modules.
var friends = require("../../core/friends");
var logger = require('../../core/logger.js');


/*
 * Jankbot will pass the full input, the ID of the user who sent it and the
 * Steam bot instance (used for messaging and other utilities).
 * This function should handle discerning the intended outcome of the command
 * and executing the functionality, responding to the user if necessary using
 * friends.messageUser() or friends.broadcast().
 */
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


/*
 * Jankbot will call this function when closing. This function should handle any
 * tasks for a graceful close. If nothing needs to be done, declare this
 * function and leave it blank.
 */
exports.onExit = function() {
}


/*
 * Jankbot will call this function when a user has requested help text. Your
 * module should return a well-formatted help section. Example:
 *
 * MODULE NAME
 * module command - Description of this command
 * module command2 - Description of this command
 */
exports.getHelp = function() {
  return "MODULE NAME\n" +
  "module command - Description of this command\n" +
  "module command2 - Description of this command\n";
}