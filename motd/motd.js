var fs = require('fs');
var friends = require('../../core/friends');
var logger = require('../../core/logger.js');

var motd = '';

// if we've saved a motd, use it
if (fs.existsSync('./data/motd.json')) {
  motd = JSON.parse(fs.readFileSync('./data/motd.json'));
}

// Saves motd.
exports.save = function() {
  fs.writeFileSync("./data/motd.json", JSON.stringify(motd));
}


// Handler.
exports.handle = function(input, source) {
  input = input.split(' ');
  userName = friends.nameOf(source);
  if (input[0] == 'motd') {
	if (friends.isAdmin(source) && input[1] == 'set') {
	  input.splice(0, 2);
      var newMotd =  input.join(" ");
      motd = newMotd;
      exports.save();
      friends.messageUser(source, 'The motd has been set to ' + motd);
	}
    else {
      if (motd == '') {
        friends.messageUser(source, 'No motd has been set.');
      }
      else {
        friends.messageUser(source, motd);
      }
    }
    return true;
  }
}

exports.onExit = function() {
  exports.save();
}

exports.getHelp = function() {
  return 'motd\n' + '\n--------\n' +
  'motd set MESSAGE - Sets the message if the user is an admin\n' +
  'motd - Get the message of the day' + '\n\n';
}
