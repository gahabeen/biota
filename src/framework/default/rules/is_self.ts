// types
// external
import { query as q } from "faunadb";
// biota
import { Rule } from "~/factory/rule";

export const is_self = Rule({
  name: "is_self",
  query: q.Equals(q.Var("ref"), q.Identity())
});
