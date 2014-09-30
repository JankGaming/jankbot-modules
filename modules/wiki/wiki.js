var friends = require("../../core/friends");
var logger = require('../../core/logger.js');
var fs = require("fs");
var config = JSON.parse(fs.readFileSync("config.json"));

if (fs.existsSync("./bot_modules/wiki/wikiData")) {
  var wiki = JSON.parse(fs.readFileSync("./bot_modules/wiki/wikiData"));
} else {
  var wiki = [];
}

String.prototype.replaceAll = function(str1, str2, ignore) {
  return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}


if (fs.existsSync("wiki")) {
  wiki =  fs.loadFileSync("wiki");
}

exports.canHandle = function(input) {
  return input.split(" ")[0] == "wiki";
}

exports.handle = function(input, source) {
  var commands = input.split(" ");
  
  if (commands[0] == "wiki") {
    if (commands.length < 2) {
      friends.messageUser(source, exports.getHelp());
      return true;
    }

    switch (commands[1]) {
      case "new" :
        createEntry(commands, source);
        break;
      case "create" :
        createEntry(commands, source);
        break;
      case "delete":
        deleteEntry(commands, source);
        break;
      case "append":
        appendEntry(commands, source);
        break;
      case "edit":
        editEntry(commands, source);
        break;
      case "permission":
        handlePermissions(commands, source);
        break;
      case "random":
        giveRandomEntry(source);
        break;
      case "list":
        listEntries(source);
        break;
      case "lastedit":
        findLastEdit(commands, source);
        break;
      default:
        // Search for an entry.
        commands.splice(0, 1);
        var search = commands.join(" ");
        var lookup = new WikiEntry(search, source);
        friends.messageUser(source, lookup.formatEntry());
        break;
    }

    return true;
  }
}


function deleteEntry(commands, source) {
  if (hasPermission(source, "delete")) {

    // Remove 'wiki new'
    commands.splice(0, 2);

    var title = commands.join(" ");

    if (entryExistsStrict(title)) {
      for (var i = 0; i < wiki.length; i++) {
        if (wiki[i].title.toLowerCase() == title.toLowerCase()) {
          wiki.splice(i, 1);
          friends.messageUser(source, "Deleted '" + title + "'");
          messageAdmins(friends.nameOf(source) + " deleted " + title);
          saveWiki();
          return;
        }
      }
    } else {
      friends.messageUser(source, "Entry does not exist");
      return;
    }

  } else {
    rejectUser(source);
  }

}

function findLastEdit(commands, source) {
  if (hasPermission(source, "giveperms")) {

    // Remove 'wiki new'
    commands.splice(0, 2);

    // Join and split by colon.
    commands = commands.join(" ");
    commands = commands.split(":");

    // The first segment is the title;
    var title = commands.splice(0, 1);
    title = title[0].trim();


    // Be sure this entry exists.
    if (!entryExists(title)) {
      friends.messageUser(source, "That entry doesnt exist.");
      return;
    }

    // We're good to go. Make the edited entry.
    var entry = new WikiEntry(title, source);
    var lastEditor = friends.nameOf(entry.lastAuthor);
    friends.messageUser(source, entry.title + " was last edited by " + lastEditor);


  } else {
    rejectUser(source);
  }
}

function editEntry(commands, source) {
  if (hasPermission(source, "edit")) {

    // Remove 'wiki new'
    commands.splice(0, 2);

    // Join and split by colon.
    commands = commands.join(" ");
    commands = commands.split(":");

    // The first segment is the title;
    var title = commands.splice(0, 1);
    title = title[0].trim();

    // The content is everything else.
    var content = commands.join(":");
    content = content.trim();

    // Be sure this entry exists.
    if (!entryExists(title)) {
      friends.messageUser(source, "That entry doesnt exist.");
      return;
    }

    // We're good to go. Make the edited entry.
    var entry = new WikiEntry(title, source);
    entry.content = content;
    entry.save();
    friends.messageUser(source, "Entry edited!\n" + entry.formatEntry());


  } else {
    rejectUser(source);
  }
}

function appendEntry(commands, source) {
  if (hasPermission(source, "append")) {

    // Remove 'wiki new'
    commands.splice(0, 2);

    // Join and split by colon.
    commands = commands.join(" ");
    commands = commands.split(":");

    // The first segment is the title;
    var title = commands.splice(0, 1);
    title = title[0].trim();

    // The content is everything else.
    var content = commands.join(":");
    content = content.trim();

    // Be sure this entry exists.
    if (!entryExists(title)) {
      friends.messageUser(source, "That entry doesnt exist.");
      return;
    }

    // We're good to go. Append to the entry.
    var entry = new WikiEntry(title, source);
    entry.content += content;
    entry.save();
    friends.messageUser(source, "Entry appended to!\n" + entry.formatEntry());


  } else {
    rejectUser(source);
  }
}


function createEntry(commands, source) {
  if (hasPermission(source, "create")) {

    // Remove 'wiki new'
    commands.splice(0, 2);

    // Join and split by colon.
    commands = commands.join(" ");
    commands = commands.split(":");

    // The first segment is the title;
    var title = commands.splice(0, 1);
    title = title[0].trim();

    // The content is everything else.
    var content = commands.join(":");
    content = content.trim();

    // Be sure this exact entry doesnt exist.
    if (entryExistsStrict(title)) {
      friends.messageUser(source, "That entry already exists.");
      return;
    }

    // We're good to go. Make the new entry.
    var entry = new WikiEntry(title, source, true);
    entry.content = content;
    entry.save();
    friends.messageUser(source, "Entry created!\n" + entry.formatEntry());


  } else {
    rejectUser(source);
  }
}


function hasPermission(source, permission) {
  var admin = friends.get(source, "wiki-giveperms");

  if (admin) {
    return true;
  }
  var del = friends.get(source, "wiki-delete");
  var edit = friends.get(source, "wiki-edit");
  var append = friends.get(source, "wiki-append");
  var create = friends.get(source, "wiki-create");

  switch(permission) {
    case "create":
      return del || create || edit;
      break;
    case "append":
      return append || edit;
      break;
    case "edit":
      return edit || del;
      break;
    case "delete":
      return del;
      break;
    default:
      return friends.get(source, "wiki-" + permission);
      break;
  }
}

function handlePermissions(commands, source) {
  if (config.admins.indexOf(source) == -1 && !friends.get(source, "wiki-giveperms")) {
    friends.messageUser(source, "You don't have permission to give permissions.\n" +
      "How 'bout dem apples?");
    return;
  }

  commands.splice(0, 2);

  if (commands.length < 3) {
    friends.messageUser(source, "Please specify give/revoke, permission type and user.");
    return;
  }

  // Stop if give or revoke was not provided.
  if (commands[0] != "give" && commands[0] != "revoke") {
    friends.messageUser(source, "You must specify give or revoke for permissions.");
    return;
  }
  var giveTake = commands[0] == "give";
  var permission = commands[1];
  if (permission != "edit" && permission != "append" && permission != "create"
        && permission != "delete" && permission != "giveperms") {
    friends.messageUser(source, "Unknown permission '" + permission + "'.\n" +
      "Possible permissions are create, edit, append, delete and giveperms");
  return;
  }

  // Check that the user exists.
  commands.splice(0, 2);
  var name = commands.join(" ");
  var user = friends.idOf(name, true);
  if (user !== undefined) {
    friends.set(user, "wiki-" + permission, giveTake);
    var realname = friends.nameOf(user);
    if (giveTake) {
      friends.messageUser(source, "Successfully gave " + realname + " the " + permission +
        " permission.");
      friends.messageUser(user, "You have received the wiki permission '" + permission + "'");
    } else {
      friends.messageUser(source, "Successfully revoked " + realname + "'s " + permission +
        " permission.");
      friends.messageUser(user, "You have lost the wiki permission '" + permission + "'");
    }
  } else {
    friends.messageUser(source, "I don't know who " + name + " is... :(");
  }


}

function rejectUser(source) {
  friends.messageUser(source, "You don't have the permissions to do that.\n" +
      "Bug an admin for permission. And by 'bug' I mean politely ask. :)");
}

exports.getHelp = function() {
  return "WIKI\n" +
  "wiki SEARCH - Searches the wiki for the given term\n" +
  "wiki edit ARTICLE_TITLE: NEW CONTENT - Updates the article specified by " +
  "ARTICLE_TITLE with the given new content. Note the colon\n" +
  "wiki append ARTICLE_TITLE: CONTENT - Appends the given content to the given article\n" +
  "wiki new ARTICLE_TITLE: NEW CONTENT - Creates an article with the given title and content." +
  "wiki delete ARTICLE_TITLE - Deletes the article with the given title\n" +
  "wiki list - Lists the articles in the wiki\n" +
  "wiki random - Gives a random wiki article\n";
}

var WikiEntry = function(title, source, forceNew) {

  this.title = "";
  this.source = source;
  this.forceNew = forceNew;

  // Try to find this entry first.
  if (entryExists(title) && !forceNew) {
    var copy = getEntry(title);
    this.title = copy.title;
    this.content = copy.content;
    this.lastEdit = copy.lastEdit;
    this.lastAuthor = copy.lastAuthor;
  } else {

    this.title = title;
    this.content = "";
    this.lastEdit = timestamp();
    this.lastAuthor = source;
  }
}


WikiEntry.prototype.formatEntry = function() {
  if (this.content == "") {
    this.content = "No entry found!";
  }

  var showContent = this.content.replaceAll("\|", "\n");
  return "\n" + this.title + "\n" + "==============\n" + showContent;
}

WikiEntry.prototype.isNew = function() {
  return !entryExists(this.title) || this.forceNew;
}

WikiEntry.prototype.save = function() {
  if (this.isNew()) {
    console.log("NEW");
    wiki.push(this);
  } else {
    var copy = getEntry(this.title);
    copy.title = this.title;
    copy.content = this.content;
    copy.lastEdit = timestamp();
    copy.lastAuthor = this.source;
  }

  saveWiki();
}

function saveWiki() {
  fs.writeFileSync("./bot_modules/wiki/wikiData", JSON.stringify(wiki));
  if (!fs.existsSync("./bot_modules/wiki/wikiBackup")) {
    fs.mkdirSync("./bot_modules/wiki/wikiBackup");
  }
  fs.writeFileSync("./bot_modules/wiki/wikiBackup/" + "wiki-" + timestampSeconds(), JSON.stringify(wiki));
}

function entryExists(title) {
  title = title.toLowerCase();
  for (var i = 0; i < wiki.length; i++) {
    if (fuzzyMatch(wiki[i].title.toLowerCase(), title)) {
      return wiki[i].title;
    }
  }
  return false;
}

function entryExistsStrict(title) {
  title = title.toLowerCase();
  for (var i = 0; i < wiki.length; i++) {
    if (wiki[i].title.toLowerCase() == title) {
      return true;
    }
  }
  return false;
}

function getEntry(title) {
  title = title.toLowerCase();
  for (var i = 0; i < wiki.length; i++) {
    if (fuzzyMatch(wiki[i].title.toLowerCase(), title)) {
      return wiki[i];
    }
  }
  return {
    title: "",
    content: "Error - This entry does not exist.",
    lastEdit: timestamp(),
    lastAuthor: "0"
  }
}

function giveRandomEntry(source) {
  if (wiki.length == 0) {
    friends.messageUser(source, "I got nothin!");
    return;
  }
  var rando = Math.floor(Math.random() * wiki.length);
  var randomEntry = new WikiEntry(wiki[rando].title, source);
  friends.messageUser(source, randomEntry.formatEntry());
}

function listEntries(source) {
  var list = "Here's a list of articles in the wiki:\n";
  for (var i = 0; i < wiki.length; i++) {
    var entry = new WikiEntry(wiki[i].title, source);
    list += entry.title + "\n";
  }
  friends.messageUser(source, list);
}

// Thanks to Dokkat for this function
// http://codereview.stackexchange.com/users/19757/dokkat
function fuzzyMatch(str,pattern){
    pattern = pattern.split("").reduce(function(a,b){ return a+".*"+b; });
    return (new RegExp(pattern)).test(str);
};

function timestamp() {
  return new Date().toLocaleDateString();
}

function timestampSeconds() {
  return Math.floor(new Date().getTime() / 1000);
}

function messageAdmins(message) {
  var friendList = friends.getAllFriends();
  for (var friend in friendList) {
    if (friendList[friend]["wiki-giveperms"] == true) {
      friends.messageUser(friend, message);
    }
  }
}