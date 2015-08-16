var fs = require('fs');
var friends = require("../../core/friends");
var logger = require('../../core/logger.js');

var quotes = [];

// if we've saved a quotes list, use it
if (fs.existsSync("./data/quotes.json")) {
  quotes = JSON.parse(fs.readFileSync("./data/quotes.json"));
}

// Saves quotes.
exports.save = function() {
  fs.writeFileSync("./data/quotes.json", JSON.stringify(quotes));
}

// Helper function to add a quote.
function addQuote(quote) {
  quotes.push(quote);
}

// Helper function to get all quotes.
function getQuotes() {
  return quotes.join("\n");
}

// Handler.
exports.handle = function(input, source) {
  input = input.split(" ");
  if (input[0] == "quote") {
    if (input.length > 2 && input[1].toLowerCase() == "add") {
      input.splice(0, 2);
      var quote = input.join(" ");
      quotes.push(quote);
      exports.save();
      friends.messageUser(source, "Saved quote.");
    }
    else if (input.length > 1 && input[1].toLowerCase() == "list") {
      friends.messageUser(source, "Here are quotes I have saved:\n" + getQuotes());
    }
    else if (input.length > 1 && input[1].toLowerCase() == "random") {
      if (quotes.length > 0) {
        friends.messageUser(source, quotes[Math.floor(Math.random() * quotes.length)]);
      } else {
        friends.messageUser(source, "I haven't stored any quotes yet!");
      }
    }
    exports.save();
    return true;
  }
}

exports.onExit = function() {
  exports.save();
}

exports.getHelp = function() {
  return "QUOTES\n" +
  "quote add _____ - Adds a quote to the quote list\n" +
  "quote list - Lists all quotes\n" +
  "quote random - Gives a random quote\n";
}
