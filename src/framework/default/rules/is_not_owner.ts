// types
// external
import { query as q } from "faunadb";
// biota
import { Rule } from "~/factory/rule";

export const is_not_owner = Rule({
  name: "is_not_owner",
  query: q.Not(q.Equals(q.Select(["data", "owner"], q.Var("doc"), null), q.Identity())),
});
