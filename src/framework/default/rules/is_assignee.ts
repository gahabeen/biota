// types
// external
import { query as q } from "faunadb";
// biota
import { Rule } from "~/factory/api/rule";

export const is_assignee = Rule({
  name: "is_assignee",
  query: q.Equals(
    q.Select(["activity", "assignees"], q.Var("doc"), null),
    q.Identity()
  )
});
