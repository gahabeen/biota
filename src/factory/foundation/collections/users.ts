import { Collection, BiotaCollectionName } from '~/factory/classes/collection';

export const users = Collection({
  name: BiotaCollectionName('users'),
  history_days: null,
  ttl_days: null,
});
