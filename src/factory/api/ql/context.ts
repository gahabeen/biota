import { query as q } from 'faunadb';
import { FactoryContextOptions } from 'types/factory/factory.context';
import * as helpers from '~/helpers';

export function ContextProp(context: FactoryContextOptions, path: string) {
  return q.Select(helpers.path(path), context, null);
}
