// types
// external
// biota
import { Collection, BiotaCollectionName } from '~/factory/classes/collection';

export const actions = Collection({
  name: BiotaCollectionName('actions'),
  history_days: null,
  ttl_days: null,
});
