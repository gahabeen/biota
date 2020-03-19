import { query as q } from 'faunadb'
import { UDFunction } from '../../../function/methods/function'

export const LogAction = UDFunction({
  name: 'Array.Reverse',
  body: q.Query(q.Lambda(['arr'], q.Reduce(q.Lambda(['reversed', 'item'], q.Prepend(q.Var('item'), q.Var('reversed'))), [], q.Var('arr'))))
})
