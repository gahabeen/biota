import { ReferenceBuilder } from './../../types'

import * as fauna from 'faunadb'
const q = fauna.query

export function reference({ collection, id, ref }: ReferenceBuilder = {}) {
  return ref ? ref : id ? q.Ref(q.Collection(collection), id) : q.Collection(collection)
}