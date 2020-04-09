import { Collection, collectionNameNormalized } from "~/factory/classes/collection";

export const users = Collection({
  name: collectionNameNormalized("users"),
  history_days: null,
  ttl_days: null,
});
