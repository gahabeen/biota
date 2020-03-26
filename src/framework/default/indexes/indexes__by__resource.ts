// types
// external
import * as fauna from 'faunadb'
const q = fauna.query
// biota
import { Index } from "~/factory/api/index"

export const indexes__by__resource = Index({
  name: 'indexes__by__resource',
  source: {
    collection: q.Indexes(),
    fields: {
      source: q.Query(
        q.Lambda(
          'index',
          q.Let(
            {
              source: q.Select('source', q.Var('index'), false),
              collection: q.Select('collection', q.Var('source'), false)
            },
            q.If(q.IsRef(q.Var('collection')), q.Var('collection'), false)
          )
        )
      )
    }
  },
  terms: [
    {
      binding: 'source'
    }
  ],
  values: [
    {
      field: ['ref']
    }
  ]
})
