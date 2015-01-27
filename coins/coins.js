var friends = require("../../core/friends");
var logger = require('../../core/logger');
var fs = require('fs');
var _ = require('lodash');
var config = require('./coins.json');

exports.compatible = '2.0.*';

var commands = [
  'balance',
  'give',
  'add',
  'default',
  'reset',
  'name'
];

exports.handle = function(input, source) {
  var input = input.split(' ');
  var command = input[1];

  if (input[0].toLowerCase() === config.name.toLowerCase()) {

    if (_.contains(commands, command)) {

      switch (command) {
        case 'reset':
          resetCoins();
          break;
        case 'balance':
          checkBalance(source);
          break;
        case 'name':
          if (friends.isAdmin(source)) {
            var newName = input.slice(2).join(' ');
            setName(newName);
            friends.messageUser(source, 'Okay, the currency is now called ' +
              newName + '(s).');
          } else {
            messageUser(source, exports.getHelp());
          }
          break;
        case 'give':
          var amount = input[2];
          var to = input.slice(3).join(' ');
          transferCoins(source, to, amount);
          break;
        case 'default':
          setDefault(input[2]);
          friends.messageUser(source, 'The default amount is now set to ' +
            input[2]);
          break;
        case 'add':
          var amount = input[2];
          var to = input.slice(3).join(' ');
          addCoins(source, to, amount);
          break;
        default:
          break;
      }

    } else {
      friends.messageUser(source, exports.getHelp());
    }
    return true;
  }
};


exports.getHelp = function() {
  var name = config.name.toLowerCase();
  return config.name.toUpperCase() + '\n--------\n' +
    name + ' balance - See your current balance\n' +
    name + ' give AMOUNT PERSON - Give ' + name + '(s) to the specified person\n\n';
};

exports.onExit = function() {
  save();
};

function setDefault(newDefault) {
  config.default = newDefault;
  save();
}

function setBalanceToDefault(friend) {
  friends.set(friend, 'coins', parseInt(config.default));
}

function setName(newName) {
  config.name = newName;
  save();
}

function addCoins(source, to, amount) {
  amount = parseInt(amount);

  // To starts as a name, do a fuzzy search to resolve it if possible.
  var toId = friends.idOf(to, true);

  if (toId === undefined) {
    friends.messageUser(from, 'I couldn\'t find anyone who has a name like "' +
      to + '"');
    return;
  }

  var toName = friends.nameOf(toId);
  var toCoins = getBalance(to);

  toCoins += amount;
  friends.set(toId, 'coins', toCoins);
  friends.messageUser(source, 'Gave ' + amount + ' ' + config.name + '(s) to ' +
    toName);
  friends.messageUser(toId, 'You have received ' + amount + ' ' + config.name +
    '(s).');
}

function transferCoins(from, to, amount) {

  amount = parseInt(amount);

  // Ensure that it is a number.
  if (amount === undefined || isNaN(amount) || !isFinite(amount)) {
    friends.messageUser(from, 'Invalid send amount.');
    return;
  }

  // Ensure the amount is a positive integer.
  if (amount < 1) {
    friends.messageUser(from, 'Cannot send less than 1 ' + config.name + 's');
    return;
  }

  // Get the balance of the donor, default if no balance.
  var fromCoins = getBalance(from);

  // First, ensure that the source has enough to give.
  if (fromCoins < amount) {
    friends.messageUser(from, 'You don\'t have enough ' + config.name + 's.');
    return;
  }

  // 'To' start as a name fragment, do a fuzzy search to resolve it if possible.
  var toId = friends.idOf(to, true);

  // Be sure we can find that user and it isn't the sender.
  if (toId === undefined) {
    friends.messageUser(from, 'I couldn\'t find anyone who has a name like "' +
      to + '"');
    return;
  } else if (toId === from) {
    friends.messageUser(from, 'Stop trying to transfer to yourself.');
    return;
  }

  // Get the names of both users.
  var toName = friends.nameOf(toId);
  var fromName = friends.nameOf(from);

  // If we're here, it means we have found the person to transfer to, and the
  // person to transfer from has enough coins. Make the transfer.
  var toCoins = getBalance(to);

  fromCoins -= amount;
  toCoins += amount;
  friends.set(from, 'coins', fromCoins);
  friends.set(toId, 'coins', toCoins);

  // Send confirmation messages.
  friends.messageUser(from, 'Successfully sent ' + amount + ' ' + config.name +
    '(s) to ' + toName + '.');

  // Don't message the user if they are muted to avoid coin spam.
  if (!friends.getMute(toId)) {
    friends.messageUser(toId, fromName + ' sent you ' + amount + ' ' +
      config.name + '(s).');
  }

}

function resetCoins() {
  friends.forEach(function(friend) {
    friends.set(friend, 'coins', config.default);
  });
}

function checkBalance(user) {
  var balance = getBalance(user);
  friends.messageUser(user, 'You have ' + balance + ' ' + config.name + '(s).');
}

function getBalance(user) {
  var balance = friends.get(user, 'coins');
  if (balance === undefined) {
    setBalanceToDefault(user);
    balance = friends.get(user, 'coins');
  }
  var intBalance = parseInt(balance);
  if (intBalance === undefined || !isFinite(intBalance)) {
    intBalance = 0;
  }
  return parseInt(balance);
}

function save() {
  fs.writeFileSync('./bot_modules/coins/coins.json', JSON.stringify(config));
}
