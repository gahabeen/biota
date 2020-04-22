import { Expr, query as q } from 'faunadb';
import { parseJSON } from '~/helpers/fauna/parse';
import { FaunaRef, FaunaRoleMembership, FaunaRoleOptions, FaunaRolePrivilege, Fauna, FaunaString } from '~/types/fauna';
import { ParseQuery, RunExpr } from './query';

export async function CurrentRoles(db: Fauna.Client, session: FaunaRef) {
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
          return q.Equals(q.Select(['collection'], session, null), membership.resource);
        }
      }),
    );
  }
}

export function TestRolePrivilege(parsedRoles: FaunaRoleOptions[], resource: Expr, action: FaunaString, inputs: any[]): Expr {
  // const privileges = parsedRole.privileges || [];
  // return q.Map(privileges, q.Lambda(['privilege'], ''));
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
            rule: input?.let?.rule,
            expr: Expr.toString(input?.let?.rule),
          },
        };
      } else if ((input?.or || input?.and) && !onlyResult) {
        if (input?.or) {
          return {
            object: {
              __or: reducer(input.or),
            },
          };
        } else if (input?.and) {
          return {
            object: {
              __and: reducer(input.and),
            },
          };
        }
      } else {
        return input;
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
