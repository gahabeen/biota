import { query as q } from "faunadb";
import { Rule } from "~/factory/role/rule";
import { Identity } from "~/factory/api/ql";

export const is_owned_by = Rule({
  query: q.Equals(q.Select("ref", q.Var("doc")), Identity()),
});
