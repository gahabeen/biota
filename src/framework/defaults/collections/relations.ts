// types
// external
// biota
import { Collection, collectionNameNormalized } from "~/factory/classes/collection";

export const relations = Collection({
  name: collectionNameNormalized("relations"),
  history_days: null,
  ttl_days: null
});
