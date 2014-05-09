var friends = require("./friends");

// Thanks to Dokkat for this function
// http://codereview.stackexchange.com/users/19757/dokkat
function fuzzyMatch(str,pattern){
    pattern = pattern.split("").reduce(function(a,b){ return a+".*"+b; });
    return (new RegExp(pattern)).test(str);
};


// Grab the input if this is a whois search.
exports.canHandle = function(input) {
  input = input.split(" ");
  return input[0] == "whois";
}

// Use fuzzy match to find the user and grab their profile link.
// TODO: Return more user information.
exports.handle = function(input, source, bot) {
  var lookup = input.split(" ");
  lookup.splice(0, 1);
  lookup = lookup.join(" ");

  var friendID = friends.idOf(lookup, true);

  if (friendID) {
    var profileURL = "http://steamcommunity.com/profiles/" + friendID;
    var friendInfo = "Who is " + friends.nameOf(friendID) + ": \n" +
    "Steam profile: " + profileURL + "\n";
    friends.messageUser(source, friendInfo, bot);
    return;
  }


  // No friend found :(
  friends.messageUser(source, "I couldn't find any user I know with a name similar to '" +
    lookup + "'. Sorry :(", bot);
}

exports.getHelp = function() {
  return "WHOIS\n" +
  "whois USERNAME - Does a fuzzy search for a friend with the given name.\n";
}