// types
// external
import { query as q } from "faunadb";
// biota
import { Rule } from "~/factory/rule";

export const is_assignee = Rule({
  name: "is_assignee",
  query: q.Equals(q.Select(["data", "_activity", "assignees"], q.Var("doc"), null), q.Identity()),
});
