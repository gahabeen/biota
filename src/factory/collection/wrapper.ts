// types
import { FaunaCollectionOptions } from '~/../types/db'

export function Collection(collection: FaunaCollectionOptions): FaunaCollectionOptions {
  let { name, data, history_days, ttl_days } = collection || {}
  return {
    name,
    data,
    history_days,
    ttl_days
  }
}
