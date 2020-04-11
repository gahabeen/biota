import { query as q } from 'faunadb';
import { DBFactoryFQLBaseUser } from '~/../types/factory/factory.fql.base';
import { upsert as upsertFQLBase } from '~/factory/api/fql/base/upsert';
import { repsert as repsertFQLBase } from '~/factory/api/fql/base/repsert';

export const user: DBFactoryFQLBaseUser = {
  auth: {
    account: {
      distinct(collection, id, account) {
        return q.Let(
          {
            account,
            provider: q.Select('provider', q.Var('account'), null),
            accountId: q.Select('id', q.Var('account'), null),
            current_accounts: q.Select(['data', '_auth', 'accounts'], q.Get(q.Ref(q.Collection(collection), id)), []),
            same_current_account: q.Filter(
              q.Var('current_accounts'),
              q.Lambda(
                'ca',
                q.And(
                  q.Equals(q.Select('provider', q.Var('ca')), q.Var('provider')),
                  q.Equals(q.Select('id', q.Var('ca')), q.Var('accountId')),
                ),
              ),
            ),
            current_accounts_without_new: q.Filter(
              q.Var('current_accounts'),
              q.Lambda(
                'ca',
                q.Not(
                  q.And(
                    q.Equals(q.Select('provider', q.Var('ca')), q.Var('provider')),
                    q.Equals(q.Select('id', q.Var('ca')), q.Var('accountId')),
                  ),
                ),
              ),
            ),
            new_account: q.Merge(q.Select(0, q.Var('same_current_account'), {}), q.Var('account')),
            new_accounts: q.Append(q.Var('current_accounts_without_new'), [q.Var('new_account')]),
          },
          q.Var('new_accounts'),
        );
      },
      difference(collection, id, provider, accountId) {
        return q.Let(
          {
            provider,
            accountId,
            current_accounts: q.Select(['data', '_auth', 'accounts'], q.Get(q.Ref(q.Collection(collection), id)), []),
            filtered_accounts: q.Filter(
              q.Var('current_accounts'),
              q.Lambda(
                'ca',
                q.Not(
                  q.And(
                    q.Equals(q.Select('provider', q.Var('ca')), q.Var('provider')),
                    q.Equals(q.Select('id', q.Var('ca')), q.Var('accountId')),
                  ),
                ),
              ),
            ),
          },
          q.Var('filtered_accounts'),
        );
      },
      upsert(collection, id, account) {
        return upsertFQLBase.document(collection, id, {
          _auth: {
            accounts: user.auth.account.distinct(collection, id, account),
          },
        });
      },
      repsert(collection, id, account) {
        return repsertFQLBase.document(collection, id, {
          _auth: {
            accounts: user.auth.account.distinct(collection, id, account),
          },
        });
      },
      delete(collection, id, provider, accountId) {
        return upsertFQLBase.document(collection, id, {
          _auth: {
            accounts: user.auth.account.difference(collection, id, provider, accountId),
          },
        });
      },
    },
  },
};
