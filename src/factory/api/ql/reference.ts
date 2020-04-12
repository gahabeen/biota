// types
import { ReferenceBuilder, Fauna } from '~/../types/db';
// external
import * as fauna from 'faunadb';
import { FaunaRef } from 'types/fauna';
const q = fauna.query;

export function Reference(collectionOrRef: string | FaunaRef, id?: string | fauna.Expr) {
  return q.If(
    q.IsRef(collectionOrRef),
    collectionOrRef,
    q.If(q.IsString(id), q.Ref(q.Collection(collectionOrRef), id), q.Ref(q.Collection(collectionOrRef))),
  );
}

export function Ref(collectionOrRef: Fauna.Expr | string, id?: string | number) {
  if (typeof collectionOrRef === 'string') {
    const [collection, withId] = collectionOrRef.split('/');
    return q.Ref(q.Collection(collection), withId);
  } else {
    return q.Ref(collectionOrRef);
  }
}
