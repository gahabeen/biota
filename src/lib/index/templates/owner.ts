import * as fauna from 'faunadb'
const q = fauna.query

export const owner = (collection) => ({
  name: `${collection}__by__owner`,
  source: { collection: q.Collection(collection) },
  terms: [{ field: ['data', 'activity', 'owner'] }]
})