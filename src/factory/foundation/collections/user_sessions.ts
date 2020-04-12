import { Collection, BiotaCollectionName } from '~/factory/classes/collection';

export const user_sessions = Collection({
  name: BiotaCollectionName('user_sessions'),
  history_days: 0,
  ttl_days: null,
});
