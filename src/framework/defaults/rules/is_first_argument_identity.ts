// types
// external
import { query as q } from "faunadb";
// biota
import { Rule } from "~/factory/role/rule";

export const is_first_argument_identity = Rule({
  name: "is_first_argument_identity",
  query: q.Lambda(
    "args",
    q.Equals(q.Select(0, q.Var("args"), null), q.Identity())
  )
});
