// types
// external
import * as fauna from 'faunadb'
const q = fauna.query
// biota

import { Index } from './wrapper'

export function NGramOnField(depth: number = 10, field: string[]): Fauna.Expr {
  return q.Union(
    q.Map(
      new Array(depth).fill(null).map((_, i) => i + 1),
      q.Lambda('min', q.NGram(q.LowerCase(q.Select(field, q.Var('instance'))), q.Var('min'), q.Add(1, q.Var('min'))))
    )
  )
}

export function SearchIndex(collection: string, depth: number = 10, fields: string[][]): Fauna.Expr {
  return Index({
    name: `${collection}__search_on__${fields.map((field) => field.join('_')).join('_and_')}`,
    source: {
      collection: q.Collection(collection),
      fields: {
        search: q.Query(q.Lambda('instance', q.Distinct(q.Union(fields.map((field) => NGramOnField(depth, field))))))
      }
    },
    terms: [{ binding: 'search' }]
  })
}
