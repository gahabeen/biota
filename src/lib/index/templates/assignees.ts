import * as fauna from 'faunadb'
const q = fauna.query

export const assignees = (collection) => ({
  name: `${collection}__by__assignees`,
  source: { collection: q.Collection(collection) },
  terms: [{ field: ['data', 'activity', 'assignees'] }]
})
