import { DB } from './../src/index'

export function client() {
  return DB({ secret: process.env.FAUNA_DB_SECRET })
}
