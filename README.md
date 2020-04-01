
# biota

A simple *opiniated* database framework for Fauna, written in Javascript/Typescript.

Including **features**, *in no specific order*, as a **permission system** (field protection, user rights, etc), **document tracking** (action history in addition to build-in document history), **complex search made simple** (inc. autocomplete), **hands-free relations** (between collections), **facilitated pagination**, **short-code ids** (read *Xh6si* instead of *23764999364764*) and lots of extra *already-build-in* logic as **expire** or **assign**  a document. 

> **Biota isn't production ready**. It's api isn't fully settled yet. Breaking changes may happen!

```js
import { Biota } from "biota"
```
```js
// 4 lines to:
const db = new Biota({ secret: "<your-secret>"})

// - scaffold the whole database (inc. users collection for ex)
await db.foundation()

// - add todos collection
await db.collection("todos").scaffold()

// - add autocomplete-search on name field
await db.collection("todos").index({field: "name", ngram: true})
```
```js
// 4 lines to:
// - create a user
let { ref } = await db.collection("users").insert({ nickname: "gahabeen" }, { password: "youdontknowme" })

// - log a user
const logged = await db.login(ref.id, "youdontknowme")

// - create a todo
await logged.collection("todos").insert({ name: "Remember to star this project" })

// - query a todo with $ngram (autocomplete behavior)
await logged.collection("todos").find({ name: { $ngram: "star" }})
// output: [{ ref, ts, data: { name: "Remember to star this project" } }]
```

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
import { Biota } from "biota"
// or
const { Biota } = require("biota")
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
// example
await logged.query( q.Create(...) )
```
### Api
Even though you can `query` your database (same as you would do with the same fauna method `query`), the main power of **Biota** lives in its [extended api](#).


> ⏳ **Patience**: It's coming.. :)

### Helpers

```js
const { q, factory } = require('biota')
// q: export the query builder, same as fauna.query 
q.If(..., true, false)
// factory: export the factory api (helpers that wrap FQL)
factory.create.database(name, options)
```

## Running the tests

If you want to run the tests, you'll need to provide a `FAUNA_KEY_TEST=<your-test-key>` in a `.env` file.

> :warning: **Careful**: At the moment tests covering everything yet. PR welcomed 😉


## Built With

* [fauna-db-js](https://github.com/fauna/faunadb-js) - Javascript driver for FaunaDB

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. 
For the versions available, see the [tags on this repository](https://github.com/gahabeen/biota/tags). 

## Authors

* **Gabin Desserprit** *instigator*

See also the list of [contributors](https://github.com/gahabeen/biota/contributors) who participated in this project.
Join us :beers:

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
This lib wouldn't exist if I had not dug deep into Fauna FQL and got helped through the [Fauna's slack community channel](fauna-community.slack.com). In no order, I'ld like to thank, for their help and support, fauna's team (**Brecht De Rooms**, **Ben Edwards**, **Marrony Neris**, **Leo Regnier**, **Summer**, ,...) as well as other users like **Eigil Sagafos** 🙏

## To bring back up (once properly set)
![Travis (.org)](https://img.shields.io/travis/gahabeen/biota?style=flat-square) ![Code Climate coverage](https://img.shields.io/codeclimate/coverage/gahabeen/biota?style=flat-square)
