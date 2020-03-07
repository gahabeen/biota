import { query as q } from 'faunadb'

import { UDFunction } from './functions/helpers/function'
import * as indexes from './indexes'

const merge = (activity, data = q.Var('data')) => q.Merge(data, { activity: q.Merge(q.Select('activity', data, {}), activity) })

const logData = {
  owner: () => merge({ owned_by: q.Var('ref'), owner_changed_at: q.Now(), owner_changed_by: q.Identity() }),
  credentials: () => merge({ credentials_changed_by: q.Var('ref'), credentials_changed_at: q.Now() }, {}),
  assign: () => merge({ assigned_to: q.Var('ref'), assigned_at: q.Now() }),
  import: () => merge({ imported_by: q.Identity(), imported_at: q.Now() }),
  create: () => merge({ created_by: q.Identity(), created_at: q.Now() }),
  update: () => merge({ updated_by: q.Identity(), updated_at: q.Now() }),
  replace: () => merge({ replaced_by: q.Identity(), replaced_at: q.Now() }),
  expire: () => merge({ expired_by: q.Identity(), expired_at: q.Var('at') }),
  delete: () => merge({ deleted_by: q.Identity(), deleted_at: q.Now() }),
  archive: () => merge({ archived_by: q.Identity(), archived_at: q.Now() })
}

/**
 * - owner only
 * - assigned only
 * - any
 */

export const PickIndex = UDFunction({
  name: 'PickIndex',
  body: q.Query(
    q.Lambda(
      ['resource', 'terms_fields'],
      q.Let(
        {
          indexes: q.Union(q.Map(q.Var('terms_fields'), q.Lambda(['field'], q.Match(q.Var('resource'), q.Var('field'))))),
          termsCount: q.Count(q.Var('terms_fields'))
        },
        q.If(
          q.GT(q.Var('termsCount'), 0),
          q.Select(0, q.Filter(q.Var('indexes'), q.Lambda(['index'], q.Equals(q.Var('termsCount'), q.ToNumber(q.Select('terms', q.Get(q.Var('index')), Infinity)))))),
          q.Abort('No found Index')
        )
      )
    )
  ),
  role: q.Role('AdminForUser')
})

export const Match = UDFunction({
  name: 'Match',
  body: q.Query(q.Lambda(['user', 'collectionRef', 'terms'], q.Match(q.Var('refIndex'), q.Var('terms'))))
})

export const Owner = UDFunction({
  name: 'Owner',
  body: q.Query(q.Lambda(['user', 'ref', 'data'], q.Update(q.Var('ref'), { data: logData.owner() }))),
  role: q.Role('AdminForUser')
})

export const ChangePassword = UDFunction({
  name: 'ChangePassword',
  body: q.Query(
    q.Lambda(
      ['user', 'ref', 'password'],
      q.Update(q.Var('ref'), {
        data: logData.credentials(),
        credentials: {
          password: q.Var('password')
        }
      })
    )
  ),
  role: q.Role('AdminForUser')
})

export const Assign = UDFunction({
  name: 'Assign',
  body: q.Query(q.Lambda(['user', 'ref', 'data'], q.Update(q.Var('ref'), { data: logData.assign() }))),
  role: q.Role('AdminForUser')
})

export const Import = UDFunction({
  name: 'Import',
  body: q.Query(q.Lambda(['user', 'ref', 'data'], q.Update(q.Var('ref'), { data: logData.import() }))),
  role: q.Role('AdminForUser')
})

export const Create = UDFunction({
  name: 'Create',
  body: q.Query(q.Lambda(['user', 'ref', 'data'], q.Update(q.Var('ref'), { data: logData.create() }))),
  role: q.Role('AdminForUser')
})

export const Update = UDFunction({
  name: 'Update',
  body: q.Query(q.Lambda(['user', 'ref', 'data'], q.Update(q.Var('ref'), { data: logData.update() }))),
  role: q.Role('AdminForUser')
})

export const Replace = UDFunction({
  name: 'Replace',
  body: q.Query(q.Lambda(['user', 'ref', 'data'], q.Do(q.Replace(q.Var('ref'), { data: q.Var('data') }), q.Update(q.Var('ref'), { data: logData.replace() })))),
  role: q.Role('AdminForUser')
})

export const Expire = UDFunction({
  name: 'Expire',
  body: q.Query(q.Lambda(['user', 'ref', 'at'], q.Update(q.Var('ref'), { data: logData.expire() }))),
  role: q.Role('AdminForUser')
})

export const Delete = UDFunction({
  name: 'Delete',
  body: q.Query(q.Lambda(['user', 'ref', 'at'], q.Update(q.Var('ref'), { data: logData.delete() }))),
  role: q.Role('AdminForUser')
})

export const Archive = UDFunction({
  name: 'Archive',
  body: q.Query(q.Lambda(['user', 'ref', 'at'], q.Update(q.Var('ref'), { data: logData.archive() }))),
  role: q.Role('AdminForUser')
})
