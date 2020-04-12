import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryDocument } from '~/../types/factory/factory.document';
import { TS_2500_YEARS } from '~/consts';
import * as helpers from '~/helpers';

// tslint:disable-next-line: only-arrow-functions
export const document: FactoryContext<FactoryDocument> = function (contextExpr): FactoryDocument {
  // tslint:disable-next-line: only-arrow-functions
  return (collectionOrRef, id) => {
    const documentApi = document(contextExpr);
    const ref = q.If(
      q.Or(q.IsDoc(collectionOrRef), q.IsCollection(collectionOrRef)),
      collectionOrRef,
      q.If(q.IsString(id), q.Ref(q.Collection(collectionOrRef), id), q.Ref(q.Collection(collectionOrRef))),
    );

    return {
      get() {
        return q.Get(ref);
      },
      insert(data) {
        return q.Create(ref, { data });
      },
      update(data) {
        return q.Update(ref, { data });
      },
      upsert(data) {
        return q.If(q.Exists(ref), documentApi(ref).update(data), documentApi(ref).insert(data));
      },
      replace(data = {}) {
        return q.Replace(ref, data);
      },
      repsert(data = {}) {
        return q.If(q.Exists(ref), documentApi(ref).replace(data), documentApi(ref).insert(data));
      },
      delete() {
        return '';
      },
      forget() {
        return q.Delete(ref);
      },
      clean() {
        return q.If(q.Exists(ref), documentApi(ref).forget(), false);
      },
      expireAt(at) {
        return documentApi(ref).update({
          _validity: {
            expires_at: at,
          },
        });
      },
      expireIn(delay) {
        return documentApi(ref).update({
          _validity: {
            expires_at: q.TimeAdd(q.Now(), q.ToNumber(delay), 'milliseconds'),
          },
        });
      },
      expireNow() {
        return documentApi(ref).update({
          _validity: {
            expires_at: q.Now(),
          },
        });
      },

      validity: {
        delete() {
          return documentApi(ref).upsert({
            _validity: {
              deleted: true,
            },
          });
        },
        expire(at) {
          return q.If(
            q.IsTimestamp(at),
            documentApi(ref).upsert({
              _validity: {
                expires_at: at,
              },
            }),
            null,
          );
        },
        restore() {
          return q.Let(
            {
              doc: q.Get(ref),
              isDeleted: q.Select(helpers.path('_validity.deleted'), q.Var('doc'), false),
              isExpired: q.GTE(q.Select(helpers.path('_validity.expires_at'), q.Var('doc'), q.ToTime(TS_2500_YEARS)), q.Now()),
            },
            q.Do(
              q.If(
                q.Var('isDeleted'),
                documentApi(ref).upsert({
                  _validity: {
                    deleted: false,
                  },
                }),
                false,
              ),
              q.If(
                q.Var('isExpired'),
                documentApi(ref).upsert({
                  _validity: {
                    expires_at: null,
                  },
                }),
                false,
              ),
            ),
          );
        },
      },
    };
  };
};
