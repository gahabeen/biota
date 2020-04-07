import { query as q } from "faunadb";
import { Rule } from "~/factory/role/rule";

export const is_owned_by = Rule({
  query: q.Equals(q.Select("ref", q.Var("doc")), q.Select(["data", "_membership", "owner"], q.Get(q.Identity()))),
});
