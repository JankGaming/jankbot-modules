#Coins module for Jankbot
By JankDota

To use this module, copy this directory into Jankbot's bot_modules/ directory.

Once installed, Jankbot will have a currency! You can even name the currency
whatever you like!

## Commands

`coin give AMOUNT RECIPIENT` sends an amount of your coins to another player (fuzzy search)

`coin balance` checks your balance

## Admin Commands

`coin name NEWNAME` sets the name of the currency to NEWNAME. All commands will use the new name
in place of `coin`

`coin add AMOUNT RECIPIENT` adds to the balance of the recipient
