// types
// external
import { query as q } from "faunadb";
// biota
import { Rule } from "~/factory/rule";

export const is_not_assignee = Rule({
  name: "is_not_assignee",
  query: q.Not(
    q.Equals(
      q.Select(["activity", "assignees"], q.Var("doc"), null),
      q.Identity()
    )
  )
});
