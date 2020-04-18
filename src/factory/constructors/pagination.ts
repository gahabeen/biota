import { query as q } from 'faunadb';
import { PAGINATION_SIZE_DEFAULT } from '~/consts';
import { FaunaPaginateOptions } from '~/types/fauna';

export function Pagination(optionsExpr: FaunaPaginateOptions) {
  const options = q.If(q.IsObject(optionsExpr), optionsExpr, {});
  return {
    after: q.Select('after', options, 0),
    // #bug
    // before: q.Select('before', options, null),
    size: q.Select('size', options, PAGINATION_SIZE_DEFAULT),
    events: q.Select('events', options, false),
    ts: q.Select('ts', options, q.Now()),
  };
}
