// types
import { FaunaIndexOptions } from '~/types'
// external
// biota

export function ToReverse(index: FaunaIndexOptions): FaunaIndexOptions {
  let { terms, data } = index || {}
  let [firstTerm = {}, ...otherTerms] = terms || []
  firstTerm.reverse = true
  return {
    ...index,
    name: `${index.name}__reverse`,
    terms: [firstTerm, ...otherTerms],
    data: { ...data, reverse: true }
  }
}
