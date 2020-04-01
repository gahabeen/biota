
# biota
![Travis (.org)](https://img.shields.io/travis/gahabeen/biota?style=flat-square) ![Code Climate coverage](https://img.shields.io/codeclimate/coverage/gahabeen/biota?style=flat-square)

A simple *opiniated* database framework for Fauna, written in Javascript/Typescript.
**Includes:** role/rules system, documents tracking, auto-indexing, complex search (inc. autocomplete), build-in action history, relations 

```js
// 10 lines to set up your database, create a user, create a todo and fuzzy search it ;)
import { Biota } from "biota"

const db = new Biota({ secret: "<your-secret>"}) // instantiates

await db.foundation() // scaffolds the database, make sure the minimum is set

await db.collection("todos").scaffold() // scaffolds a todos collection

await db.collection("todos").index({field: "name", ngram: true}) // index a field for autocomplete search

let { ref } = await db.collection("users").insert({ nickname: "gahabeen" }, { password: "youdontknowme" }) // adds a user

const logged = await db.login(ref.id, "youdontknowme") // logs in as the user

// you can know query as the user
const todos = logged.collection("todos")

await todos.insert({ name: "Remember to star this project" })

await todos.find({ name: { $ngram: "star" }})
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
await db.query( fqlQuery )
```

2. You can use the function `.login(id, password)` to log a user.  
```js
const db = new Biota()
const logged = await db.login("123", "super_password123")
// example
await logged.query( fqlQuery )
```
### Api
Even though you can `query` your database (same as you would do with the same fauna method `query`), the main power of **Biota** lives in its [extended api](#).

### Helpers

```js
const { q, factory } = require('biota')
// q: export the query builder, same as fauna.query
// factory: export the factory api (helpers that wrap FQL)
```

## Running the tests

If you want to run the tests, you'll need to provide a `FAUNA_KEY_TEST=<your-test-key>` in a `.env` file.

> :warning: **Careful**: At the moment tests covering everything yet. PR welcomed 😉

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Requirements
- Node 10.10.0 min
## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
