#Mumble module for Jankbot
By JankDota

**THIS MODULE WAS DESIGNED TO WORK WITH MUMBLE SERVERS HOSTED BY MUMBLE.COM
IF YOU ARE RUNNING YOUR OWN MURMUR INSTANCE YOU MAY NEED TO FIND ALTERNATE
INSTRUCTIONS**

To use this module, copy mumble.js into Jankbot's bot_modules/ directory, then
add it by running 'node config module add' and follow the instructions.

Before this module can access your mumble information, you will need to make a
file called 'mumbleinfo' in your Jankbot folder which contains the API url for
your mumble channel. This can be found easily if you are using mumble.com as
your host.

To do so, log in to your control panel and go to Server Settings. Click on
'Status on your site'. At the bottom of the page, you will see two URLs under
"Your Mumble JSON CVP URLS". Copy either of those URLs into your mumbleinfo file
and Jankbot will be ready to show you your mumble status.