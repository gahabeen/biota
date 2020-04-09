// types
// external
// biota
import { Collection, collectionNameNormalized } from "~/factory/classes/collection";

export const actions = Collection({
  name: collectionNameNormalized("actions"),
  history_days: null,
  ttl_days: null
});
