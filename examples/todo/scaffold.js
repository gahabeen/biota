require('dotenv').config()

const { DB } = require('./../../')

async function scaffold() {
  const db = new DB({ secret: process.env.FAUNA_DB_SECRET })

  // collections
  await db.scaffold.collections.defaults()

  // db.query({
  //   collections: db.scaffold.collections.defaults(),
  //   todos: db.scaffold.collection('todos')
  // })

  // indexes
  // await db.query({
  //   users: db.scaffold.indexes.defaults(),
  //   todos: db.scaffold.indexes.for('todos')
  // })

  // functions
  // await db.query({
  //   defaults: db.scaffold.functions.defaults(),
  //   todos: db.scaffold.functions.for('todos')
  // })

  // roles
  // await db.query({
  //   users: db.scaffold.roles.defaults()
  // })
}

;(async () => {
  await scaffold()
})().catch(console.error)

module.exports = scaffold
