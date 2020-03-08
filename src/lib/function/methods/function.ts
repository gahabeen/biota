import { Expr } from 'faunadb'
import { FaunaFunction, FaunaRef } from './../../../types'

export function UDFunction(fn: FaunaFunction): FaunaFunction {
  let { name, body, data, role } = fn || {}
  let self = {
    name,
    body,
    data,
    role,
    setBody(newBody: Expr) {
      return UDFunction({ name, body: newBody, data, role })
    },
    setData(newData: object) {
      return UDFunction({ name, body, data: newData, role })
    },
    setRole(newRole: FaunaRef | string) {
      return UDFunction({ name, body, data, role: newRole })
    }
  }

  return self
}
