// types
// external
// biota
import { Collection, BiotaCollectionName } from "~/factory/api/collection";

export const relations = Collection({
  name: BiotaCollectionName("relations"),
  history_days: null,
  ttl_days: null
});
