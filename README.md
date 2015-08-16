Jankbot Module Collection
===============

This repo serves as the main collection of centralized Jankbot modules. Here you will find 1st 
party and community developed Jankbot modules, ready to go.

## Installing Modules

As of Jankbot 2.1.0, modules can be installed via `npm`.

To install a module, just do `npm install jankbot-MODULENAME` in the root level Jankbot directory.

Currently, the following JankDota Jankbot modules can be installed from npm:

* `jankbot-quotes`

Others soon to follow.

To install a legacy module for Jankbot, move the entire directory for the module you wish to install
into the `bot_modules` directory in your Jankbot. The next time you run Jankbot, it will be
discovered at startup and loaded up into Jankbot.

## Submitting Your Modules

If you are a developer who wants to submit a Jankbot module of your own creation, make a pull
request to this repo with the module you want to add. A repo maintainer will review the module
and merge the pull request if its up to snuff! You can also feel free to make pull requests which
modify or improve existing modules in the repo.

## License

All modules in this repo are licensed under the MIT open source license:

Copyright (c) 2015 JankDota & Contributors (as defined in CONTRIBUTORS)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
