import { FaunaIndexOptions } from './../../../types'

export function ReverseIndex(index: FaunaIndexOptions): FaunaIndexOptions {
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
