import * as fauna from 'faunadb'
const q = fauna.query

export const assigned_to = (collection) => ({
  name: `${collection}__by__assigned_to`,
  source: { collection: q.Collection(collection) },
  terms: [{ field: ['data', 'activity', 'assigned_to'] }]
})
