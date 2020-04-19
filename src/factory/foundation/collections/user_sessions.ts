import { Collection, BiotaCollectionName } from '~/factory/constructors/collection';

// tslint:disable-next-line: variable-name
export const user_sessions = Collection({
  name: BiotaCollectionName('user_sessions'),
  history_days: 0,
  ttl_days: null,
});
