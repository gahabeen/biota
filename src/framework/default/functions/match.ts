// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction } from "~/factory/api/udfunction";

export const Match = UDFunction({
  name: "Match",
  body: q.Query(
    q.Lambda(
      ["user", "collectionRef", "terms"],
      q.Match(q.Var("refIndex"), q.Var("terms"))
    )
  )
});
