import { client } from './client'

const db = client()
;(async () => {
  db.scaffold()
})()
