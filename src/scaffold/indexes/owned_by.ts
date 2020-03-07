import * as fauna from 'faunadb'
const q = fauna.query

export const owned_by = (collection) => ({
  name: `${collection}__by__owned_by`,
  source: { collection: q.Collection(collection) },
  terms: [{ field: ['data', 'activity', 'owned_by'] }]
})