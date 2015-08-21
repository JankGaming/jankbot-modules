# Twitter module for Jankbot
By JankDota

## Setup

This module requires a twitter API key. You will need to generate a twitter API
key by logging in to [twitter's dev site](http://dev.twitter.com) and making
a new application.

Next, make a file in `data/` in your Jankbot directory called `tweet.json` and use this template:

```javascript
{
  "consumer_key":         "YOUR-CONSUMER-KEY",
  "consumer_secret":      "YOUR-CONSUMER-SECRET",
  "access_token":         "YOUR-ACCESS-TOKEN",
  "access_token_secret":  "YOUR-ACCESS-TOKEN-SECRET",
  "allowed": [
    "YOUR-STEAM-ID"
  ]
}
```

Fill out the consumer and access tokens, and put the list of approved user IDs in the `allowed` array.

## Commands

This module will not list commands in the help section, as they are private to the list of steam
IDs defined in `tweet.json`.

`tweet [SOME MESSAGE]` will tweet the given message
