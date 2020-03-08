require('dotenv').config({
  path: './../../.env'
})

const { DB } = require('../../dist')

const log = (p) => p.then((x) => console.log(JSON.stringify(x, null, 2))).catch(console.error)

;(async () => {
  const db = new DB({ secret: process.env.FAUNA_DB_SECRET })
  // log(
  //   db.query({
  //     collections: db.collections(),
  //     indexes: db.indexes()
  //   })
  // )

  // const me = await db.collection("users").get("3652263320760886").query()
  // console.log("me", me);

  const user = await db.login('3652263320760886', 'test')
  log(
    db.query({
      users: user.collection('users')
      // me: user.collection('users').get('3652263320760886')
    })
  )

  // const db = new DB({ secret: 'fnEDma5om3ACAAOXbOZ90AILTdVQpEAp46A_kZrqF1SrDp9VlPA' })
  // log(db.client.query(db.q.Identity()))

  // const me = await user.me.get().query()
  // console.log('me', me)
  // user.me
  //   .get()
  //   .then(console.log)
  //   .catch(console.error)
})().catch(console.error)
