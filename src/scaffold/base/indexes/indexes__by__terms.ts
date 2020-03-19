import * as fauna from 'faunadb'
const q = fauna.query

import { Index } from '../../../index/wrapper'

export const indexes__by__terms = Index({
  name: 'indexes__by__terms',
  source: {
    collection: q.Indexes(),
    fields: {
      terms: q.Query(
        q.Lambda(
          'index',
          q.Map(
            q.Select('terms', q.Var('index'), []),
            q.Lambda(
              'term',
              q.If(
                q.Contains('binding', q.Var('term')),
                q.Concat(['binding:', q.Select('binding', q.Var('term'), '')], ''),
                q.Concat(['term:', q.Concat(q.Select('field', q.Var('term'), []), '.')], '')
              )
            )
          )
        )
      )
    }
  },
  terms: [
    {
      binding: 'terms'
    }
  ],
  values: [
    {
      field: ['ref']
    }
  ]
})
