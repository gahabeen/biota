require('dotenv').config()
const { DB } = require('../../types/db')

async function role() {
  const db = new DB({ secret: process.env.FAUNA_DB_SECRET })

  await db.create

    .role({
      name: 'test',
      membership: {
        resource: db.q.Collection('users')
      },
      privileges: [
        {
          resource: db.q.Collection('users'),
          actions: {
            read: true
          }
        },
        {
          resource: db.q.Collection('users'),
          actions: {
            read: false
          }
        }
      ]
    })
    .query()
}

role()
