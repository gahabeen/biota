import { Collection, BiotaCollectionName } from '~/factory/constructors/collection';

// tslint:disable-next-line: variable-name
export const sessions = Collection({
  name: BiotaCollectionName('sessions'),
  history_days: 0,
  ttl_days: null,
});
