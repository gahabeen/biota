import { Collection, collectionNameNormalized } from '~/factory/classes/collection';

export const user_sessions = Collection({
  name: collectionNameNormalized('user_sessions'),
  history_days: 0,
  ttl_days: null,
});
