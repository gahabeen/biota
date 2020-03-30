// types
import { FaunaCollectionOptions } from "~/../types/db";

export function BiotaCollectionName(name: string) {
  return `biota.${CollectionNamePlural(name.replace("biota.", ""))}`;
}

export function CollectionNameSingular(name: string) {
  return name.endsWith("s") ? name.slice(-1) : name;
}

export function CollectionNamePlural(name: string) {
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
