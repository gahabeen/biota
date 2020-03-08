import * as fauna from 'faunadb'
const q = fauna.query

import { Index } from '../methods/index'
import { } from "../../rule/methods/rule"

export function access(collection) {
  return Index({
    name: `${collection}__access`,
    source: { collection: q.Collection(collection), fields: {
      owner:"",
      assignee: "",
      any: ""
    } },
    terms: [{ field: ['data', 'activity', 'owner'] }]
  })
}
