import * as fauna from 'faunadb'
const q = fauna.query

export function Batch(fqlQueries: fauna.Expr[]) {
  return fqlQueries
}
