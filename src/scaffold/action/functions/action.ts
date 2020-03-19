import { query as q } from 'faunadb'
import { UDFunction } from '../../../function/methods/function'

export const LogAction = UDFunction({
  name: 'LogAction',
  body: q.Query(
    q.Lambda(
      ['documentRef', 'ts', 'userRef', 'actionName'],
      q.Create(q.Collection('actions'), {
        data: {
          document: q.Var('documentRef'),
          ts: q.Var('ts'),
          user: q.Var('userRef'),
          name: q.Var('actionName')
        }
      })
    )
  )
})

