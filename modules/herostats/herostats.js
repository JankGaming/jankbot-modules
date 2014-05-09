var friends = require("./friends");
var request = require("../node_modules/request");
var API_URL = "http://dotaheroes.herokuapp.com/heroes/";

exports.canHandle = function(input) {
  var text = input.split(" ");
  if (text[0] == "herostats" || text[0] == "hs") {
    return true;
  }
}

exports.handle = function(input, source, bot) {
  var input = input.split(" ");
  if (input[1] == "help") {
    getFields(source, bot);
  } else {
    var stat = input[1];
    input.splice(0, 2);
    var hero = input.join(" ");
    hero = toTitleCase(hero);
    heroLookup(hero, stat, source, bot);
  }
}

function heroLookup(hero, stat, source, bot) {
// Get the json for this hero.
request({uri: API_URL + hero},
  function(err, resp, body) {

    // If successful.
    if (!err && resp.statusCode == 200) {

      // Parse the response.
      body = body.toLowerCase();
      var lowerStat = stat.toLowerCase();
      var stats = JSON.parse(body);

      // Get the specific stat.
      var lookedUpStat = stats[lowerStat];

      if (lowerStat == "primarystat") {
        lookedUpStat = (lookedUpStat == 0) ? "STR" : (lookedUpStat == 1) ? "AGI" : "INT";
      } else if (lowerStat == "alignment") {
        lookedUpStat = (lookedUpStat == 0) ? "Radiant" : "Dire";
      }

      // If this stat exists, send the info back. Else, error.
      if (lookedUpStat != undefined) {
        friends.messageUser(source, stat + " for " + hero + " is " + lookedUpStat, bot);
      } else {
        friends.messageUser(source, "Couldn't look up " + stat + " for " + hero, bot);
      }
    } else {
      // Couldn't lookup.
      console.log(err);
      friends.messageUser(source, "Error accessing HeroStats API.");
    }
  });
}

function getFields(source, bot) {
  request({uri: API_URL + "Earthshaker"},
    function(err, resp, body) {

    // If successful.
    if (!err && resp.statusCode == 200) {
      var fields = "Here are the fields you can look up:\n";
      for (var field in JSON.parse(body)) {
        fields += field + "\n";
      }

      fields += "To look up a field, chat 'herostats STAT HERONAME'.";

      friends.messageUser(source, fields, bot);
    }

  });
}


// Thanks Dexter (http://stackoverflow.com/users/10717/dexter) for this function.
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

exports.getHelp = function() {
  return "HEROSTATS\n" +
    "herostats STATNAME HERONAME - Looks up the given stat for the given hero.\n" +
    "hs STATNAME HERONAME - Shorter alias for 'herostats'\n" +
    "herostats help - List what stats you can look up.\n";
}