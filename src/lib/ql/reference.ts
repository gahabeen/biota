import { ReferenceBuilder } from '../../types'

import * as fauna from 'faunadb'
const q = fauna.query

export function Reference({ collection, id, ref }: ReferenceBuilder = {}) {
  return ref ? ref : id ? q.Ref(q.Collection(collection), id) : q.Collection(collection)
}

export function Ref(collectionOrRef: Fauna.Expr | string, id?: string | number) {
  if (typeof collectionOrRef === 'string') {
    const [collection, withId] = collectionOrRef.split('/')
    return q.Ref(q.Collection(collection), withId)
  } else {
    return q.Ref(collectionOrRef)
  }
}
