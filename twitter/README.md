#Twitter module for Jankbot
By JankDota

To use this module, copy this directory into Jankbot's `bot_modules/` directory.

## Setup

After copying this module into your `bot_modules/` directory, run `npm install twit` to install
dependencies for this module.

This module requires a twitter API key. You will need to generate a twitter API
key by logging in to [twitter's dev site](http://dev.twitter.com) and making
a new application. Paste your consumer and access tokens into `tweet.json`, and
put whatever steam IDs you want to allow to tweet in the `allowed` array in
the `tweet.json` file.
