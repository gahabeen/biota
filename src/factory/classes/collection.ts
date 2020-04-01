// types
import { FaunaCollectionOptions } from "~/../types/db";
// biota
import { CONVENTION } from "~/consts";

export function collectionNameNormalized(name: string) {
  return `${CONVENTION.COLLECTION_PREFIX}${collectionNamePlural(
    name.replace(CONVENTION.COLLECTION_PREFIX, "")
  )}`;
}

export function collectionNameSingular(name: string) {
  return name.endsWith("s") ? name.slice(-1) : name;
}

export function collectionNamePlural(name: string) {
  return !name.endsWith("s") ? name + "s" : name;
}

export function Collection(
  collection: FaunaCollectionOptions
): FaunaCollectionOptions {
  let { name, data, history_days, ttl_days } = collection || {};
  return {
    name,
    data,
    history_days,
    ttl_days
  };
}
