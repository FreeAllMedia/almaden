# Almaden.js [![npm version](https://img.shields.io/npm/v/almaden.svg)](https://www.npmjs.com/package/almaden) [![license type](https://img.shields.io/npm/l/almaden.svg)](https://github.com/FreeAllMedia/almaden.git/blob/master/LICENSE) [![npm downloads](https://img.shields.io/npm/dm/almaden.svg)](https://www.npmjs.com/package/almaden) ![ECMAScript 6 & 5](https://img.shields.io/badge/ECMAScript-6%20/%205-red.svg)

Universal data adapter providing a normalized interface for interacting with data sources on servers and browsers.

<!-- When used on a server, Almaden.js is powered by `knex.js`, a rock-solid database adapter with many client types such as `mysql`, `sqlite`, `postgres`, `oracle`, and more.

When used in the browser, Almaden.js uses the exact same interface to call remote APIs, just as though the APIs were a database on the server.

**Server Example:** -->

```javascript
import Database from "almaden";

const database = new Database({
	"debug": false,
	"client": "mysql",
	"connection": {
		"host": "localhost",
		"user": "root",
		"password": "",
		"database": "almaden_test"
	}
});

database
	.insert({name:"Bob"})
	.into("users")
	.results((error, rows) => {

	});
```

<!-- **Browser Example:**

```javascript
import Database from "almaden";

const database = new Database({
	"debug": false,
	"client": "json-api",
	"connection": {
		"host": "https://api.freeallmedia.com/",
		"authentication": {
				"path": "client",
				"method": "GET",
				"headers": {
					"Api-Key": "Your API Key Here"
				},
				"tokenName": "clientAccessToken"
		}
	}
});

database
	.select("*")
	.from("users")
	.where("id", 1)
	.results((error, rows) => {
		// Remotely called `GET https://api.freeallmedia.com/client`
		// Remotely called `GET https://api.freeallmedia.com/users/1`
	});
``` -->

## Features

### Normalized Interface

**Knex.js:**

``` javascript
knex
	.select("*")
	.from("users")
	.where("id", 1);

knex("users")
	.insert({name:"Bob"});

knex.schema
	.createTable("users", tableConstructor);
```

**Almaden.js:**

```javascript
database
	.select("*")
	.from("users")
	.where("id", 1);

database
	.insert({name:"Bob"})
	.into("users");

database
	.creatTable("users", tableConstructor);
```

### Built-In Mocking

``` javascript
const mockResponseData = [
	{id:1,name:"Bob"},
	{id:2,name:"Gary"}
];

database.mock({
	"select * from users":
		mockResponseData,

	"select * from users where id=#$@#$":
		new Error("This is a mocked error response."),

	/select \* from users where id=[a-zA-Z]*/:
		new Error("ID must be numeric.")
});

database
	.select("*")
	.from("users")
	.results((error, rows) => {
		rows.should.eql(mockResponseData); // true
	});

database
	.select("*")
	.from("users")
	.where("id", "#$@#$")
	.results((error, rows) => {
		error.message.should.eql("This is a mocked error response.")
	});

database
	.select("*")
	.from("users")
	.where("id", "abc")
	.results((error, rows) => {
		error.message.should.eql("ID must be numeric.")
	});
```

### Portable Queries

```javascript
const query = database.select("*");

typeof query; // Query

query.where("id", 4);

query.results((error, rows) => {
	// Do something with the results
});
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
