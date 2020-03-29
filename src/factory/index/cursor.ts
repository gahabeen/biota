// types
import { FaunaIndexOptions } from '~/../types/db'
// external
import { query as q } from 'faunadb'
// biota


export function Cursor(pathArray: string | string[]) {
  return q.Query(q.Lambda('doc', q.Select(pathArray, q.Var('doc'), Infinity)))
}

export function ToCursor(index: FaunaIndexOptions): FaunaIndexOptions {
  const { name, source = {}, terms = [] } = index || {}
  let pathArray
  try {
    pathArray = terms[0].field
  } catch (error) {
    pathArray = undefined
  }
  if (pathArray) {
    return {
      name,
      source: {
        ...source,
        fields: {
          cursor: Cursor(pathArray)
        }
      },
      values: [{ binding: 'cursor' }, { field: ['ref'] }]
    }
  } else {
    return undefined
  }
}
