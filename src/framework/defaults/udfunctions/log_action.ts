// types
// external
import { query as q } from 'faunadb';
// biota
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { BiotaCollectionName } from '~/factory/classes/collection';
import { CallIsPrivateKeyValid } from '~/framework/helpers/call_functions';
import { BiotaRoleName } from '~/factory/classes/role';

export const LogAction = UDFunction({
  name: BiotaFunctionName('LogAction'),
  body: q.Query(
    q.Lambda(
      ['identity', 'private_key', 'options'],
      q.Let(
        {
          allowOperation: CallIsPrivateKeyValid(q.Var('identity'), q.Var('private_key')),
          document: q.Select('document', q.Var('options'), null),
          ts: q.Select('ts', q.Var('options'), null),
          name: q.Select('name', q.Var('options'), null),
        },
        q.If(
          q.IsRef(q.Var('document')),
          q.Create(q.Collection(BiotaCollectionName('actions')), {
            data: {
              document: q.Var('document'),
              ts: q.Var('ts'),
              user: q.Var('identity'),
              name: q.Var('name'),
            },
          }),
          {},
        ),
      ),
    ),
  ),
  role: q.Role(BiotaRoleName('system')),
});
