# Biota has been living for a while in a new dedicated Organization over there: https://github.com/biotajs
# Developement is on hold before I find some time to make it available to the world :)  
Gabin.

----


<h1 align="center">biota</h1>
<p align="center">A simple database framework to start your next project in 30s with FaunaDB</p>

<div align="center">

[![Feature requests](https://img.shields.io/badge/feature-requests-violet?style=flat-square)](https://github.com/gahabeen/biota/issues?q=is%3Aopen+is%3Aissue+label%3A%22Type%3A+Feature%22) [![npm](https://img.shields.io/npm/v/biota?style=flat-square)](https://www.npmjs.com/package/biota) [![npm](https://img.shields.io/npm/dm/biota?style=flat-square)](https://www.npmjs.com/package/biota) ![GitHub](https://img.shields.io/github/license/gahabeen/biota?style=flat-square) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/biota?style=flat-square)

</div>
 
Find the *raw* [documentation here](https://gahabeen.github.io/biota).

```js
import { Biota } from "biota";
```

```js
// 4 lines to:
const db = new Biota({ secret: "<your-secret>" });

// - scaffold the whole database (inc. users collection for ex)
await db.foundation();

// - add todos collection
await db.collection("todos").scaffold();

// - add autocomplete-search on name field
await db.collection("todos").index({ field: "name", ngram: true });
```

```js
// 4 lines to:
// - create a user & login
let asUser = await db.user().register("my@email.com", "password", {
  nickname: "Georgy",
});

// - create a todo
await asUser.documents("todos").insert({ name: "Remember to star this project" });

// - query a todo with $ngram (autocomplete behavior)
await asUser.documents("todos").find({ name: { $ngram: "star" } });
// output: [{ ref, ts, data: { name: "Remember to star this project" } }]
```

## Current status

> Finishing up design and tests of the main API (400+ methods).

> 🙃 You're on preview release. Don't get scared though, the api is pretty stable but tests need to be added to be fool-proof. (Thus, as of yet, Biota isn't production ready)

> ❤️ [Check the features](https://github.com/gahabeen/biota/issues?q=is%3Aopen+is%3Aissue+label%3A%22Type%3A+Feature%22) and [request the ones](https://github.com/gahabeen/biota/issues?q=is%3Aopen+is%3Aissue+label%3A%22Type%3A+Feature%22) you would love to see in **biota**. (They arn't all listed yet!)

> Found some errors? [Let us know!](https://github.com/gahabeen/biota/issues/new)


## Getting Started

These instructions will take you through the few steps to get started playing with your [Fauna](fauna.com/) database.

### Prerequisites

You'll need to add `biota` either as a global or local (project) dependency.

```js
yarn add biota // -G for global
// or
npm i biota // -G for global
```

### Import

```js
import { Biota } from "biota";
// or
const { Biota } = require("biota");
```

### Instance

There are **two ways** to instantiate Biota.

1. You can use a `admin/server key` (or any secret key) as a paremeter.

```js
const db = new Biota({ secret: "<your-secret>"})
// example
await db.query( q.Create(...) )
```

2. You can use the function `.login(id, password)` to log a user.

```js
const db = new Biota()
const logged = await db.login("123", "super_password123")
// which is a shortcut for
const logged = await db.current.user.login("123", "super_password123")

// example
await logged.query( q.Create(...) )
```

### Api

Even though you can `query` your database (same as you would do with the same fauna method `query`), the main power of **Biota** lives in its [extended api](#).

> ⏳ **Patience**: It's coming.. :)

### Helpers

```js
const { q, factory, Page } = require('biota')
// q: export the query builder, same as fauna.query
q.If(..., true, false)
// factory: export the factory api (helpers that wrap FQL)
factory.database(ctx)(name).insert(options)
```

## Running the tests

If you want to run the tests, you'll need to provide a `FAUNA_KEY_TEST=<your-test-key>` in a `.env` file.

> :warning: **Careful**: At the moment tests covering everything yet. PR welcomed 😉

## Built With

- [fauna-db-js](https://github.com/fauna/faunadb-js) - Javascript driver for FaunaDB

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning.
For the versions available, see the [tags on this repository](https://github.com/gahabeen/biota/tags).

## Authors

- **Gabin Desserprit** _instigator_

See also the list of [contributors](https://github.com/gahabeen/biota/contributors) who participated in this project.
Join us :beers:

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

This lib wouldn't exist if I had not dug deep into Fauna FQL and got helped through the [Fauna's slack community channel](fauna-community.slack.com). In no order, I'ld like to thank, for their help and support, fauna's team (**Brecht De Rooms**, **Ben Edwards**, **Marrony Neris**, **Leo Regnier**, **Summer**, ,...) as well as other users like **Eigil Sagafos** 🙏
