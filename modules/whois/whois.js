var friends = require("../../core/friends");
var logger = require('../../core/logger.js');

// Thanks to Dokkat for this function
// http://codereview.stackexchange.com/users/19757/dokkat
function fuzzyMatch(str,pattern){
    pattern = pattern.split("").reduce(function(a,b){ return a+".*"+b; });
    return (new RegExp(pattern)).test(str);
};

// Use fuzzy match to find the user and grab their profile link.
// TODO: Return more user information.
exports.handle = function(input, source) {
  var lookup = input.split(" ");
  if (lookup[0] === "whois" && typeof input[1] === "string") {
    lookup.splice(0, 1);
    lookup = lookup.join(" ");

    var friendsList = friends.getAllFriends();
    for (var friend in friendsList) {
      var thisFriend = friendsList[friend].name;

      // If this fuzzily matched, get info.
      if (fuzzyMatch(thisFriend.toLowerCase(), lookup.toLowerCase())) {
        var foundFriend = friendsList[friend];
        var profileURL = "http://steamcommunity.com/profiles/" + friend;

        var friendInfo = "Who is " + foundFriend.name + ": \n" +
        "Steam profile: " + profileURL + "\n";
        friends.messageUser(source, friendInfo);
        return true;
      }
    }

    // No friend found :(
    friends.messageUser(source, "I couldn't find any user I know with a name similar to '" +
      lookup + "'. Sorry :(");
    return true;
  }
}


exports.getHelp = function() {
  return "WHOIS\n" +
  "whois USERNAME - Does a fuzzy search for a friend with the given name.\n";
}
