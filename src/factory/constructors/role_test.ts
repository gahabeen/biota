import { Expr, query as q } from 'faunadb';
import { Fauna, FaunaRef, FaunaRoleMembership, FaunaRoleOptions, FaunaRolePrivilege, FaunaString } from '~/types/fauna';
import { ParseQuery, RunExpr } from './query';
// import { parseJSON } from '~/helpers/fauna/parse';
import * as fs from 'fs';

const safe = (x: any) => JSON.parse(JSON.stringify(x));

export async function CurrentRoles(db: Fauna.Client, session: FaunaRef): Promise<FaunaRoleOptions[]> {
  const roles = await db.query(q.Map(q.Paginate(q.Roles(), { size: 1000 }), (x) => q.Get(x))).then((res: any) => res.data);
  const parsedRoles = roles.map(ParseRole);
  const hasRoles = [];
  for (const parsedRole of parsedRoles) {
    const hasRole = await db.query(TestRoleMembership(parsedRole, session));
    if (hasRole) hasRoles.push(parsedRole);
  }
  return hasRoles;
}

export function ParseRole(role: FaunaRoleOptions): FaunaRoleOptions {
  const name = role?.name || '';
  let membership: FaunaRoleOptions['membership'][] = Array.isArray(role?.membership)
    ? role?.membership
    : role?.membership
    ? [role?.membership]
    : [];
  let privileges: FaunaRoleOptions['privileges'][] = (role?.privileges as FaunaRoleOptions['privileges'][]) || [];

  membership = membership.map((member: FaunaRoleMembership) => {
    const { resource, predicate } = member;
    return {
      resource,
      predicate: ParseQuery(predicate),
    };
  });

  privileges = privileges.map((privilege: FaunaRolePrivilege) => {
    const actions = {};
    for (const action of Object.keys(privilege?.actions || {})) {
      actions[action] = ParseQuery(privilege?.actions[action]);
    }
    return {
      resource: privilege?.resource,
      actions,
    };
  });

  const self = {
    name,
    membership,
    privileges,
  };

  return self;
}

// #improve Move it to a function, not a "constructor"
export function TestRoleMembership(parsedRole: FaunaRoleOptions, session: Expr = null): Expr {
  const memberships = Array.isArray(parsedRole.membership) ? parsedRole.membership : [parsedRole.membership];
  if (memberships.length === 0) {
    return false;
  } else {
    return q.All(
      memberships.map((membership: FaunaRoleMembership) => {
        if (membership.predicate) {
          return RunExpr(RuleTestQuery((membership as any).predicate, { onlyResult: true }), [session]);
        } else {
          // console.log(safe(session));
          // console.log(membership.resource);
          return q.Equals(q.Select(['ref', 'collection'], safe(session), -2), membership.resource['@ref'].id);
        }
      }),
    );
  }
}

// const equalsResources = (res1: any, res2: any) => {
//   // const safe = (x: any) => JSON.parse(JSON.stringify(x));
//   const safe = (x: any) => JSON.parse(JSON.stringify(parseJSON(JSON.stringify(x))));
//   console.log(safe(res1));
//   console.log(safe(res2));
//   return safe(res1) === safe(res2);
// };

// const equalsRefs = (ref1: any, ref2: any) => {
//   return (
//     (ref1?.id === ref2?.id || ref1?.['@ref']?.id === ref2?.['@ref']?.id) &&
//     (ref1?.collection?.id === ref2?.collection?.id || ref1?.['@ref']?.collection?.['@ref']?.id === ref2?.['@ref']?.collection?.['@ref']?.id)
//   );
// };

// export function pickRolePrivileges(parsedRoles: FaunaRoleOptions[], resource: Expr) {
//   const privileges = [];
//   for (const parsedRole of parsedRoles) {
//     for (const privilege of parsedRole.privileges as FaunaRolePrivilege[]) {
//       if (privilege.resource?.['@ref']?.id === 'biota.actions') {
//         console.log('privilege.resource', privilege.resource, equalsResources(privilege.resource, q.Collection('biota.actions')));
//       }
//     }
//   }
//   return;
// }

interface TestRolePrivilegeOptions {
  roles: FaunaRoleOptions[];
  session: Expr;
  resource: Expr;
  action: string;
  inputs: any[];
  onlyResult: boolean;
}

export function TestRolePrivilege(options: TestRolePrivilegeOptions): Expr {
  const { roles, resource, action, inputs, onlyResult = true, session } = options || {};
  const safeResource = safe(resource);
  const [collection, id] = Object.entries(safeResource)[0];
  const privileges = roles.reduce((list, role) => {
    for (const privilege of role.privileges as FaunaRolePrivilege[]) {
      if (
        (privilege as any)?.resource?.['@ref']?.id === id &&
        (privilege as any)?.resource?.['@ref']?.collection?.['@ref']?.id === `${collection}s`
      ) {
        list.push(privilege);
      }
    }
    return list;
  }, []);

  if (privileges.length === 0) {
    return false;
  } else {
    const resultFn = (x: any) => (onlyResult ? q.Any(x) : x);
    return resultFn(
      privileges.map((privilege: FaunaRolePrivilege) => {
        if (privilege.actions[action]) {
          const query = RunExpr(RuleTestQuery(privilege.actions[action], { onlyResult, session }), inputs);
          fs.writeFileSync('query.json', JSON.stringify(query, null, 2));
          return query;
        } else {
          return false;
        }
      }),
    );
  }
}

export function RuleTestQuery(
  rule: JSON,
  { identity = null, session = null, onlyResult = false }: { identity?: FaunaRef; session?: FaunaRef; onlyResult?: boolean } = {},
) {
  const jsonRule = JSON.parse(JSON.stringify(rule));
  const lambda = jsonRule?.lambda || jsonRule?.['@query']?.lambda;
  const expression = jsonRule?.expr || jsonRule?.['@query']?.expr;
  const reducer = (input: any) => {
    if (Array.isArray(input)) {
      return input.map(reducer);
    } else if (input && typeof input === 'object') {
      if (input?.let?.$BiotaRuleContext) {
        const exprLet = input.let;
        if (identity) exprLet.passportUser = identity;
        if (session) exprLet.passportSession = session;
        return {
          let: exprLet,
          in: reducer(input.in),
        };
      } else if (input?.let?.$BiotaRule && !onlyResult) {
        return {
          object: {
            name: input?.let?.name,
            result: input?.let?.rule,
            details: reducer(input?.let?.rule),
            rule: Expr.toString(input?.let?.rule),
          },
        };
      } else if ((input?.or || input?.and) && !onlyResult) {
        if (input?.or) {
          return {
            object: {
              __or: reducer(input.or),
              result: q.Any(new Expr(input.or)),
            },
          };
        } else if (input?.and) {
          return {
            object: {
              __and: reducer(input.and),
              result: q.All(new Expr(input.and)),
            },
          };
        }
      } else {
        return Object.entries(input).reduce((obj, [key, value]) => {
          obj[key] = reducer(value);
          return obj;
        }, {});
      }
    } else {
      return input;
    }
  };

  return expression
    ? ParseQuery({
        lambda,
        expr: reducer(expression),
      })
    : null;
  // return expression ? ParseQuery(reducer(expression)) : null;
}
