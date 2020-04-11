import { query as q } from 'faunadb';
import { UDFunction, udfunctionNameNormalized } from '~/factory/classes/udfunction';
import { indexNameNormalized } from '~/factory/classes/index';
import { roleNameNormalized } from '~/factory/classes/role';

export const FindIndex = UDFunction({
  name: udfunctionNameNormalized('FindIndex'),
  body: q.Query(
    q.Lambda(
      ['identity', 'resource', 'terms_fields'],
      q.Let(
        {
          indexes: q.Paginate(
            q.Intersection(
              q.Match(q.Index(indexNameNormalized('indexes__by__resource')), [q.Var('resource')]),
              q.Union(
                q.Map(
                  q.Var('terms_fields'),
                  q.Lambda(['field'], q.Match(q.Index(indexNameNormalized('indexes__by__terms')), [q.Var('field')])),
                ),
              ),
            ),
          ),
          termsCount: q.Count(q.Var('terms_fields')),
          filteredIndexes: q.Filter(
            q.Var('indexes'),
            q.Lambda(['index'], q.Equals(q.Var('termsCount'), q.Count(q.Select('terms', q.Get(q.Var('index')), Infinity)))),
          ),
        },
        q.Select(0, q.Var('filteredIndexes'), null),
      ),
    ),
  ),
  role: q.Role(roleNameNormalized('system')),
});
