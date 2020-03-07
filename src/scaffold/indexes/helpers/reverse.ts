import * as fauna from 'faunadb'
const q = fauna.query

export const ReverseIndex = (index) => {
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
