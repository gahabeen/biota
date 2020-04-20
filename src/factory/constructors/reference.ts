import { query as q } from 'faunadb';
import { Fauna } from '~/types/db';
import { FaunaRef, FaunaString } from '~/types/fauna';

export function Reference(collectionOrRef: FaunaString | FaunaRef, id?: FaunaString) {
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
