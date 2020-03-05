import * as fauna from 'faunadb'

export function client(secret) {
  return new fauna.Client({ secret })
}
