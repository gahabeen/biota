// types
// external
// biota
import { Collection, BiotaCollectionName } from '~/factory/constructors/collection';

export const relations = Collection({
  name: BiotaCollectionName('relations'),
  history_days: null,
  ttl_days: null,
});
