require('dotenv').config()

const { DB } = require('./../../')

async function scaffold() {
  const db = new DB({ secret: process.env.FAUNA_DB_SECRET })

  // collections
  await db.query({
    users: db.upsert.collection('users'),
    todos: db.upsert.collection('todos')
  })

  // indexes
  await db.query({
    users: db.scaffold.for,
    todos: db.upsert.collection('todos')
  })

}

module.exports = scaffold
