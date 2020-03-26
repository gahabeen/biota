import { client } from './client'

const db = client()
;(async () => {
  const collections = await db.collections()
  const indexes = await db.indexes()
  await db
    .query({
      collections,
      indexes
    })
    .then(console.log)
    .catch(console.error)
})()
