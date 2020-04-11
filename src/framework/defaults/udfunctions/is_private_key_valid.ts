import { query as q } from 'faunadb';
import { UDFunction, udfunctionNameNormalized } from '~/factory/classes/udfunction';

export const IsPrivateKeyValid = ({ privateKey }: any = {}) =>
  UDFunction({
    name: udfunctionNameNormalized('IsPrivateKeyValid'),
    body: q.Query(
      q.Lambda(
        ['identity', 'private_key'],
        q.Let(
          {
            privateKey,
          },
          q.If(
            q.IsString(q.Var('privateKey')),
            q.If(q.Equals(q.Var('private_key'), q.Var('privateKey')), true, q.Abort(`This function is restricted`)),
            true,
          ),
        ),
      ),
    ),
  });
