// types
// external
import { query as q, Expr } from "faunadb";
// biota
import { RuleBuilder } from "~/factory/role/rule";

export const has_role = RuleBuilder({
  name: "has_role",

  query: (doc: Expr, role: string) =>
    q.GT(
      q.Filter(
        q.Select(["_access", "roles"], doc, []),
        q.Lambda(["role"], q.Equals(q.Role(role), q.Var("role")))
      ),
      0
    )
});
