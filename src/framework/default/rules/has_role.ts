// types
// external
import { query as q } from "faunadb";
// biota
import { RuleBuilder } from "~/factory/api/rule";

export const has_role = RuleBuilder({
  name: "has_role",
  query: role =>
    q.Filter(
      q.Select(["roles"], q.Var("doc"), []),
      q.Lambda(["role"], q.Equals(q.Role(role), q.Var("role")))
    )
});
