// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";

export const Reverse = UDFunction({
  name: udfunctionNameNormalized("Array.Reverse"),
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
