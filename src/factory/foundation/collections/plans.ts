import { Collection, BiotaCollectionName } from '~/factory/constructors/collection';

export const plans = Collection({
  name: BiotaCollectionName('plans'),
  history_days: null,
  ttl_days: null,
});
