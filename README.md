# Almaden.js [![npm version](https://img.shields.io/npm/v/almaden.svg)](https://www.npmjs.com/package/almaden) [![license type](https://img.shields.io/npm/l/almaden.svg)](https://github.com/FreeAllMedia/almaden.git/blob/master/LICENSE) [![npm downloads](https://img.shields.io/npm/dm/almaden.svg)](https://www.npmjs.com/package/almaden) ![ECMAScript 6 & 5](https://img.shields.io/badge/ECMAScript-6%20/%205-red.svg)

ES6 data adapter.

```javascript
import Almaden from "almaden";

const almaden = new Almaden;
almaden.saySomething(); // will output "Something"
```

# Quality and Compatibility

[![Build Status](https://travis-ci.org/FreeAllMedia/almaden.png?branch=master)](https://travis-ci.org/FreeAllMedia/almaden) [![Code Climate](https://codeclimate.com/github/FreeAllMedia/almaden/badges/gpa.svg)](https://codeclimate.com/github/FreeAllMedia/almaden) [![Dependency Status](https://david-dm.org/FreeAllMedia/almaden.png?theme=shields.io)](https://david-dm.org/FreeAllMedia/almaden?theme=shields.io) [![Dev Dependency Status](https://david-dm.org/FreeAllMedia/almaden/dev-status.svg)](https://david-dm.org/FreeAllMedia/almaden?theme=shields.io#info=devDependencies)

*Every build and release is automatically tested on the following platforms:*

![node 0.12.x](https://img.shields.io/badge/node-0.12.x-brightgreen.svg) ![node 0.11.x](https://img.shields.io/badge/node-0.11.x-brightgreen.svg) ![node 0.10.x](https://img.shields.io/badge/node-0.10.x-brightgreen.svg)
![iojs 2.x.x](https://img.shields.io/badge/iojs-2.x.x-brightgreen.svg) ![iojs 1.x.x](https://img.shields.io/badge/iojs-1.x.x-brightgreen.svg)


[![Sauce Test Status](https://saucelabs.com/browser-matrix/almaden.svg)](https://saucelabs.com/u/almaden)


*If your platform is not listed above, you can test your local environment for compatibility by copying and pasting the following commands into your terminal:*

```
npm install almaden
cd node_modules/almaden
gulp test-local
```

# Installation

Copy and paste the following command into your terminal to install Almaden:

```
npm install almaden --save
```

## Import / Require

```
// ES6
import almaden from "almaden";
```

```
// ES5
var almaden = require("almaden");
```

```
// Require.js
define(["require"] , function (require) {
    var almaden = require("almaden");
});
```

# Getting Started

## More insights

In order to say something, you should know that `almaden()` ... (add your test here)

# How to Contribute

See something that could use improvement? Have a great feature idea? We listen!

You can submit your ideas through our [issues system](https://github.com/FreeAllMedia/almaden/issues), or make the modifications yourself and submit them to us in the form of a [GitHub pull request](https://help.github.com/articles/using-pull-requests/).

We always aim to be friendly and helpful.

## Running Tests

It's easy to run the test suite locally, and *highly recommended* if you're using Almaden.js on a platform we aren't automatically testing for.

```
npm test
```


