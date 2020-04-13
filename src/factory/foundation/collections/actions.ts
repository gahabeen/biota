// types
// external
// biota
import { Collection, BiotaCollectionName } from '~/factory/constructors/collection';

export const actions = Collection({
  name: BiotaCollectionName('actions'),
  history_days: null,
  ttl_days: null,
});
