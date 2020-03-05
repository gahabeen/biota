import { query as q } from 'faunadb'
import * as roles from './roles'

const merge = (activity, data = q.Var('data')) => q.Merge(data, { activity: q.Merge(q.Select('activity', data, {}), activity) })

const data = {
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

export const FunctionMatch = {
  name: 'FunctionMatch',
  body: q.Query(q.Lambda(['user', 'ref', "match"], q.)),
}

export const FunctionMatchHidden = {
  name: 'FunctionMatchHidden',
  body: q.Query(q.Lambda(['user', 'ref', 'data'], q.Update(q.Var('ref'), { data: data.assign() }))),
}

export const FunctionOwner = {
  name: 'FunctionOwner',
  body: q.Query(q.Lambda(['user', 'ref', 'data'], q.Update(q.Var('ref'), { data: data.owner() }))),
  role: q.Role(roles.AdminForUser.name)
}

export const FunctionChangePassword = {
  name: 'FunctionChangePassword',
  body: q.Query(
    q.Lambda(
      ['user', 'ref', 'password'],
      q.Update(q.Var('ref'), {
        data: data.credentials(),
        credentials: {
          password: q.Var('password')
        }
      })
    )
  ),
  role: q.Role(roles.AdminForUser.name)
}

export const FunctionAssign = {
  name: 'FunctionAssign',
  body: q.Query(q.Lambda(['user', 'ref', 'data'], q.Update(q.Var('ref'), { data: data.assign() }))),
  role: q.Role(roles.AdminForUser.name)
}

export const FunctionImport = {
  name: 'FunctionImport',
  body: q.Query(q.Lambda(['user', 'ref', 'data'], q.Update(q.Var('ref'), { data: data.import() }))),
  role: q.Role(roles.AdminForUser.name)
}

export const FunctionCreate = {
  name: 'FunctionCreate',
  body: q.Query(q.Lambda(['user', 'ref', 'data'], q.Update(q.Var('ref'), { data: data.create() }))),
  role: q.Role(roles.AdminForUser.name)
}

export const FunctionUpdate = {
  name: 'FunctionUpdate',
  body: q.Query(q.Lambda(['user', 'ref', 'data'], q.Update(q.Var('ref'), { data: data.update() }))),
  role: q.Role(roles.AdminForUser.name)
}

export const FunctionReplace = {
  name: 'FunctionReplace',
  body: q.Query(q.Lambda(['user', 'ref', 'data'], q.Do(q.Replace(q.Var('ref'), { data }), q.Update(q.Var('ref'), { data: data.replace() })))),
  role: q.Role(roles.AdminForUser.name)
}

export const FunctionExpire = {
  name: 'FunctionExpire',
  body: q.Query(q.Lambda(['user', 'ref', 'at'], q.Update(q.Var('ref'), { data: data.expire() }))),
  role: q.Role(roles.AdminForUser.name)
}

export const FunctionDelete = {
  name: 'FunctionDelete',
  body: q.Query(q.Lambda(['user', 'ref', 'at'], q.Update(q.Var('ref'), { data: data.delete() }))),
  role: q.Role(roles.AdminForUser.name)
}

export const FunctionArchive = {
  name: 'FunctionArchive',
  body: q.Query(q.Lambda(['user', 'ref', 'at'], q.Update(q.Var('ref'), { data: data.archive() }))),
  role: q.Role(roles.AdminForUser.name)
}
