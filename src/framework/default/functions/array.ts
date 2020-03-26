// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction } from "~/factory/api/udfunction";

export const Reverse = UDFunction({
  name: "Array.Reverse",
  body: q.Query(
    q.Lambda(
      ["arr"],
      q.Reduce(
        q.Lambda(
          ["reversed", "item"],
          q.Prepend(q.Var("item"), q.Var("reversed"))
        ),
        [],
        q.Var("arr")
      )
    )
  )
});
