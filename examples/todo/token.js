require('dotenv').config()
const { DB } = require('./../../')

async function token() {
  console.log(process.env.FAUNA_DB_SECRET);
  const db = new DB({ secret: process.env.FAUNA_DB_SECRET })
  const { q, ql } = db

  // console.log('db', db)

  // let res = await db.get(ql.Ref('users/3652263320760886')).query()
  // let res = await db.create.token(ql.Ref('users/3652263320760886')).query()
  // let res = await db.tokens().query()
  let res = await db.log(db.query(db.tokens()))
  // console.log('res', res)
}

token()
